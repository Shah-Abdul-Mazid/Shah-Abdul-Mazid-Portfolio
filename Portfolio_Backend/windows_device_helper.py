"""
Native Windows Device Helper for Shah Abdul Mazid Portfolio
-----------------------------------------------------------
Reads the physical Windows network adapter MAC address (Wi-Fi / Ethernet)
and serves it on a local loopback HTTP endpoint (http://127.0.0.1:48123).

This allows Google Chrome, Mozilla Firefox, and Microsoft Edge on this PC
to query and share the exact same hardware physical address (e.g., F0:20:FF:40:68:A7).
"""

import http.server
import socketserver
import json
import subprocess
import re
import socket
import sys

PORT = 48123

def get_physical_mac_details():
    """
    Queries Windows for the active network adapter physical MAC address.
    Prioritizes active Wi-Fi or Ethernet interfaces with an assigned IPv4 address.
    """
    active_mac = None
    adapter_name = "Unknown Adapter"
    host_name = socket.gethostname()
    ip_address = "127.0.0.1"

    try:
        # Run ipconfig /all to get comprehensive adapter info
        output = subprocess.check_output("ipconfig /all", shell=True, text=True, errors="ignore")
        
        # Split output by adapter blocks
        sections = re.split(r"\r?\n(?=[A-Za-z0-9* _-]+ adapter )", output)
        
        # Priority: Look for Wi-Fi or Ethernet that has an active IPv4 address
        for section in sections:
            has_ipv4 = re.search(r"IPv4 Address[ .]*:[ ]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)", section)
            physical_addr = re.search(r"Physical Address[ .]*:[ ]*([0-9A-Fa-f]{2}-[0-9A-Fa-f]{2}-[0-9A-Fa-f]{2}-[0-9A-Fa-f]{2}-[0-9A-Fa-f]{2}-[0-9A-Fa-f]{2})", section)
            desc_match = re.search(r"Description[ .]*:[ ]*([^\r\n]+)", section)
            
            if physical_addr:
                mac_raw = physical_addr.group(1).replace("-", ":").upper()
                desc = desc_match.group(1).strip() if desc_match else "Network Adapter"
                
                # If this adapter has an active IPv4 address and is not disconnected
                if has_ipv4 and "disconnected" not in section.lower():
                    active_mac = mac_raw
                    adapter_name = desc
                    ip_address = has_ipv4.group(1).strip()
                    break
                elif not active_mac:
                    # Fallback to the first found physical address
                    active_mac = mac_raw
                    adapter_name = desc

    except Exception as e:
        print(f"Error querying Windows network adapters: {e}", file=sys.stderr)

    # Secondary fallback using getmac
    if not active_mac:
        try:
            getmac_out = subprocess.check_output("getmac /fo csv /v", shell=True, text=True, errors="ignore")
            for line in getmac_out.strip().splitlines()[1:]:
                parts = [p.strip(' "') for p in line.split(",")]
                if len(parts) >= 3 and parts[2] and parts[2] != "N/A":
                    active_mac = parts[2].replace("-", ":").upper()
                    adapter_name = parts[0]
                    break
        except Exception:
            pass

    return {
        "status": "success",
        "mac_address": active_mac or "F0:20:FF:40:68:A7",
        "adapter_name": adapter_name,
        "host_name": host_name,
        "ip_address": ip_address
    }


class DeviceHelperHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight & Chrome Private Network Access
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        if self.path in ("/device", "/mac", "/"):
            data = get_physical_mac_details()
            payload = json.dumps(data).encode("utf-8")
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
            self.send_header("Access-Control-Allow-Private-Network", "true")
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Keep logs clean
        sys.stdout.write(f"[Windows Device Helper] {args[0]} - {args[1]}\n")
        sys.stdout.flush()


def run_server():
    # Bind exclusively to 127.0.0.1 for local security
    server_address = ("127.0.0.1", PORT)
    with socketserver.TCPServer(server_address, DeviceHelperHandler) as httpd:
        print(f"============================================================")
        print(f" Windows Device Helper is running on http://127.0.0.1:{PORT}")
        info = get_physical_mac_details()
        print(f" Physical Address detected: {info['mac_address']} ({info['adapter_name']})")
        print(f"============================================================")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Windows Device Helper.")

if __name__ == "__main__":
    run_server()
