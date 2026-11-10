import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Automatically load .env if environment variables aren't already set
function loadEnv() {
    const envCandidates = [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '../.env'),
        path.resolve(__dirname, '../.env')
    ];
    for (const p of envCandidates) {
        if (fs.existsSync(p)) {
            const lines = fs.readFileSync(p, 'utf8').split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) continue;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx !== -1) {
                    const key = trimmed.slice(0, eqIdx).trim();
                    let val = trimmed.slice(eqIdx + 1).trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    if (!process.env[key]) {
                        process.env[key] = val;
                    }
                }
            }
        }
    }
}

loadEnv();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

if (!ELEVENLABS_API_KEY || !AGENT_ID) {
    console.warn('⚠️  ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID is not defined. Skipping ElevenLabs KB sync.');
    process.exit(0);
}

// 2. Format cvData into high-density Markdown knowledge base for the LLM
function formatCvToText(data) {
    const p = data.personal;
    return `# KNOWLEDGE BASE: ${p.name.toUpperCase()}

## 1. PERSONAL & CONTACT INFORMATION
- **Full Name:** ${p.name}
- **Professional Title:** ${p.title}
- **Specialization Tags:** ${p.tags.join(', ')}
- **Location:** ${p.location}
- **Email:** ${p.email}
- **Phone:** ${p.phone}
- **Portfolio Website:** ${p.portfolio || 'https://shahabdulmazidezan.me'}
- **LinkedIn:** ${p.linkedin}
- **GitHub:** ${p.github}
${p.scholar ? `- **Google Scholar:** ${p.scholar}` : ''}
${p.orcid ? `- **ORCID:** ${p.orcid}` : ''}
${p.researchgate ? `- **ResearchGate:** ${p.researchgate}` : ''}

## 2. PROFESSIONAL SUMMARY
${data.summary}

## 3. CORE HIGHLIGHTS & KEY METRICS
${data.highlights.map(h => `- **${h.title}:** ${h.description}`).join('\n')}

## 4. ACHIEVEMENTS & AWARDS
${data.achievements.map(a => `- ${a}`).join('\n')}

## 5. TECHNICAL SKILLS & PROFICIENCIES
${data.skills.map(s => `- **${s.category}:** ${s.items.join(', ')}`).join('\n')}

## 6. TOOLS, PLATFORMS & FRAMEWORKS
${data.toolsAndPlatforms.map(tp => `- **${tp.category}:** ${tp.items.join(', ')}`).join('\n')}

## 7. WORK EXPERIENCE
${data.experience.map(e => `### ${e.role} | ${e.company} (${e.location})
*Period:* ${e.period}
*Key Responsibilities & Impact:*
${e.points.map(pt => `  - ${pt}`).join('\n')}`).join('\n\n')}

## 8. FEATURED PROJECTS
${data.projects.map(proj => `### ${proj.title} — ${proj.subtitle}
- **Description:** ${proj.description}
- **Technologies Used:** ${proj.tech.join(', ')}
${proj.points && proj.points.length > 0 ? `- **Key Details:**\n${proj.points.map(pt => `  * ${pt}`).join('\n')}` : ''}`).join('\n\n')}

## 9. RESEARCH PUBLICATIONS
${data.publications.map((pub, idx) => `### [${idx + 1}] ${pub.title} (${pub.year})
- **Authors:** ${pub.authors || p.name}
- **Venue / Conference:** ${pub.conference}
${pub.doi ? `- **DOI:** ${pub.doi}` : ''}
${pub.url ? `- **URL:** ${pub.url}` : ''}`).join('\n\n')}

## 10. EDUCATION
${data.education.map(ed => `- **${ed.degree}** — ${ed.institution} (${ed.period})
  * ${ed.details || ed.major || ''} ${ed.result ? `| Result / CGPA: ${ed.result}` : ''}`).join('\n')}

## 11. CERTIFICATIONS
${data.certifications.map(c => `- ${c}`).join('\n')}

## 12. COMPETITIONS & AWARDS
${data.competitions.map(comp => `- **${comp.title}** (${comp.year}) — Organized by ${comp.organizer}`).join('\n')}

## 13. LANGUAGES
${data.languages.map(l => `- **${l.name}:** ${l.proficiency}`).join('\n')}

## 14. RESEARCH INTERESTS & CAREER FOCUS
- **Research Interests:** ${data.researchInterests.join(', ')}
- **Career Focus:** ${data.careerFocus.join(', ')}

## 15. PORTFOLIO & REPOSITORIES NAVIGATION
${data.profiles.map(pr => `- **${pr.label}:** [${pr.text}](${pr.url})`).join('\n')}

---
*Notice for Assistant: You are Shah Abdul Mazid's interactive AI assistant representing him on his portfolio website. Answer questions professionally, politely, accurately, and concisely based on this verified knowledge base.*
`;
}

async function updateKnowledgeBase() {
    console.log('🚀 Loading cvData from src/data/cvData.ts...');
    const { cvData } = await import('../src/data/cvData.ts');

    const formattedText = formatCvToText(cvData);
    console.log(`📝 Generated Knowledge Base document (${formattedText.length} characters).`);

    const headers = { 'xi-api-key': ELEVENLABS_API_KEY };

    // Step A: Fetch current agent details to find previous portfolio_kb document(s)
    console.log(`🔍 Fetching agent configuration for ID: ${AGENT_ID}...`);
    const agentRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, { headers });
    if (!agentRes.ok) {
        throw new Error(`Failed to fetch agent details: ${agentRes.status} ${await agentRes.text()}`);
    }
    const agentData = await agentRes.json();
    const existingKbList = agentData.conversation_config?.agent?.prompt?.knowledge_base || [];
    console.log(`📋 Found ${existingKbList.length} current knowledge base item(s) on the agent.`);

    // Identify old portfolio documents to clean up after attaching the new one
    const oldPortfolioDocs = existingKbList.filter(item => 
        item.name === 'portfolio_kb.txt' || 
        item.name === 'portfolio_knowledge_base.txt' ||
        item.name === 'cvData_knowledge_base.txt'
    );

    // Step B: Upload the updated document to ElevenLabs Knowledge Base
    console.log('📤 Uploading updated cvData knowledge base to ElevenLabs...');
    const formData = new FormData();
    const blob = new Blob([formattedText], { type: 'text/plain' });
    formData.append('file', blob, 'portfolio_kb.txt');

    const uploadRes = await fetch('https://api.elevenlabs.io/v1/convai/knowledge-base', {
        method: 'POST',
        headers,
        body: formData
    });

    if (!uploadRes.ok) {
        throw new Error(`Failed to upload document to Knowledge Base: ${uploadRes.status} ${await uploadRes.text()}`);
    }

    const uploadData = await uploadRes.json();
    const newDocId = uploadData.id;
    console.log(`✅ Uploaded document successfully! New Document ID: ${newDocId}`);

    // Step C: Update the agent to attach the new document (and remove older duplicate versions)
    console.log('🔗 Attaching new document to agent knowledge base...');
    const retainedDocs = existingKbList.filter(item => !oldPortfolioDocs.some(old => old.id === item.id));
    const updatedKbList = [
        ...retainedDocs,
        {
            type: 'text',
            name: 'portfolio_kb.txt',
            id: newDocId,
            usage_mode: 'auto'
        }
    ];

    const patchPayload = {
        conversation_config: {
            agent: {
                prompt: {
                    knowledge_base: updatedKbList
                }
            }
        }
    };

    const patchRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`, {
        method: 'PATCH',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchPayload)
    });

    if (!patchRes.ok) {
        throw new Error(`Failed to link document to agent: ${patchRes.status} ${await patchRes.text()}`);
    }
    console.log('🎉 Successfully linked updated Knowledge Base to agent!');

    // Step D: Clean up previous documents from ElevenLabs storage to avoid orphaned files
    for (const oldDoc of oldPortfolioDocs) {
        if (oldDoc.id === newDocId) continue;
        try {
            console.log(`🧹 Cleaning up old knowledge base document ID: ${oldDoc.id}...`);
            await fetch(`https://api.elevenlabs.io/v1/convai/knowledge-base/${oldDoc.id}`, {
                method: 'DELETE',
                headers
            });
        } catch (cleanupErr) {
            console.warn(`Could not delete old doc ${oldDoc.id}:`, cleanupErr.message);
        }
    }

    console.log('✨ ElevenLabs AI agent Knowledge Base is fully up-to-date with your latest cvData!\n');
}

updateKnowledgeBase().catch(err => {
    console.error('❌ Error updating ElevenLabs Knowledge Base:', err);
    process.exit(1);
});
