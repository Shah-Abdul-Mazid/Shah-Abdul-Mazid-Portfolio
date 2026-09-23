tf_svg = '''<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6F00"/>
      <stop offset="100%" stop-color="#FFA000"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <!-- Outer Shield -->
  <path d="M150 12 L260 52 C260 160 215 240 150 288 C85 240 40 160 40 52 Z" fill="url(#bgGrad)" stroke="#FF6F00" stroke-width="6"/>
  <!-- Inner Ring -->
  <path d="M150 26 C210 65 244 110 244 160 C244 220 200 256 150 274 C100 256 56 220 56 160 C56 110 90 65 150 26 Z" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>
  <!-- TensorFlow Emblem T -->
  <path d="M150 65 L210 100 L210 135 L175 115 L175 190 L125 190 L125 115 L90 135 L90 100 Z" fill="url(#tfGrad)"/>
  <path d="M150 65 L210 100 L175 115 L150 100 Z" fill="#FF8F00"/>
  <path d="M150 65 L90 100 L125 115 L150 100 Z" fill="#FFA000"/>
  <path d="M125 115 L150 100 L150 190 L125 190 Z" fill="#FF6F00"/>
  <path d="M175 115 L150 100 L150 190 L175 190 Z" fill="#FF8F00"/>
  <!-- Ribbon banner -->
  <rect x="50" y="200" width="200" height="30" rx="6" fill="#FF6F00"/>
  <text x="150" y="219" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">TENSORFLOW</text>
  <text x="150" y="244" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="1">DEVELOPER</text>
  <text x="150" y="260" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" text-anchor="middle">DeepLearning.AI</text>
</svg>'''

dataeng_svg = '''<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="deGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="bgGradDE" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>
  </defs>
  <path d="M150 12 L260 52 C260 160 215 240 150 288 C85 240 40 160 40 52 Z" fill="url(#bgGradDE)" stroke="#38bdf8" stroke-width="6"/>
  <!-- Database Stack Icon -->
  <ellipse cx="150" cy="80" rx="50" ry="18" fill="url(#deGrad)"/>
  <path d="M100 80 V110 C100 120 122 128 150 128 C178 128 200 120 200 110 V80" fill="none" stroke="#38bdf8" stroke-width="4"/>
  <path d="M100 110 V140 C100 150 122 158 150 158 C178 158 200 150 200 140 V110" fill="none" stroke="#38bdf8" stroke-width="4"/>
  <path d="M100 140 V170 C100 180 122 188 150 188 C178 188 200 180 200 170 V140" fill="none" stroke="#38bdf8" stroke-width="4"/>
  <rect x="50" y="200" width="200" height="30" rx="6" fill="#0284c7"/>
  <text x="150" y="219" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">DATA ENGINEERING</text>
  <text x="150" y="244" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="1">PROFESSIONAL</text>
  <text x="150" y="260" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#7dd3fc" text-anchor="middle">DeepLearning.AI</text>
</svg>'''

certnexus_svg = '''<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cnGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="cnBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#27272a"/>
    </linearGradient>
  </defs>
  <!-- Gold Shield -->
  <path d="M150 12 L260 52 C260 160 215 240 150 288 C85 240 40 160 40 52 Z" fill="url(#cnBg)" stroke="url(#cnGold)" stroke-width="8"/>
  <path d="M150 30 L240 62 C240 152 202 222 150 264 C98 222 60 152 60 62 Z" fill="none" stroke="url(#cnGold)" stroke-width="2"/>
  <!-- Central Emblem -->
  <circle cx="150" cy="115" r="42" fill="url(#cnGold)" opacity="0.15"/>
  <circle cx="150" cy="115" r="36" fill="none" stroke="url(#cnGold)" stroke-width="3"/>
  <polygon points="150,88 158,106 177,106 162,118 168,136 150,124 132,136 138,118 123,106 142,106" fill="url(#cnGold)"/>
  <!-- Banner -->
  <rect x="44" y="175" width="212" height="34" rx="6" fill="url(#cnGold)"/>
  <text x="150" y="196" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#09090b" text-anchor="middle" letter-spacing="1.5">DATA SCIENCE</text>
  <text x="150" y="228" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="1.2">PRACTITIONER (CDSP)</text>
  <text x="150" y="246" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">CERTNEXUS CERTIFIED</text>
</svg>'''

with open('Portfolio_Frontend/public/badges/deeplearning-tensorflow.svg', 'w') as f:
    f.write(tf_svg)

with open('Portfolio_Frontend/public/badges/deeplearning-dataeng.svg', 'w') as f:
    f.write(dataeng_svg)

with open('Portfolio_Frontend/public/badges/certnexus-cdsp.svg', 'w') as f:
    f.write(certnexus_svg)

print("Generated vector badges successfully.")
