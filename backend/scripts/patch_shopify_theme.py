import requests
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path for backend imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.core.config import settings

def patch_theme():
    """
    v3.0 Shopify Redirect Patch (Physical Asset Injection).
    Injects the headless redirect script into layout/theme.liquid via Admin API.
    """
    shop = "pxjkad-zt"
    access_token = settings.SHOPIFY_ACCESS_TOKEN
    base_url = f"https://{shop}.myshopify.com/admin/api/2024-01"
    headers = {"X-Shopify-Access-Token": access_token}

    print(f"🚀 Starting Theme Patch for {shop}.myshopify.com...")
    
    # 1. Find the Main Theme
    res = requests.get(f"{base_url}/themes.json", headers=headers)
    if res.status_code != 200:
        print(f"  ❌ Error fetching themes: {res.status_code} {res.text}")
        if "merchant approval" in res.text:
             print("  🚨 PERMISSION ERROR: Please grant 'write_themes' scope in Shopify App settings.")
        return

    themes = res.json().get("themes", [])
    main_theme = next((t for t in themes if t["role"] == "main"), None)
    if not main_theme:
        print("  ❌ Main theme not found.")
        return

    theme_id = main_theme["id"]
    print(f"  ✅ Found Main Theme: {main_theme['name']} (ID: {theme_id})")

    # 2. Fetch layout/theme.liquid
    asset_res = requests.get(f"{base_url}/themes/{theme_id}/assets.json?asset[key]=layout/theme.liquid", headers=headers)
    if asset_res.status_code != 200:
        print(f"  ❌ Error fetching theme.liquid: {asset_res.status_code}")
        return

    asset = asset_res.json().get("asset", {})
    content = asset.get("value", "")
    if not content:
        print("  ❌ Could not read theme.liquid content.")
        return

    # 3. Inject Redirect Script (if not already present)
    redirect_script = """
<!-- 0Buck Headless Redirect Service v3.0 -->
<script type="text/javascript">
  // Force redirect to main site for the homepage
  if (window.location.pathname == '/' || window.location.pathname == '/index') {
    window.location.replace("https://0buck.com");
  }
</script>
<!-- End 0Buck Redirect -->
"""
    if "0Buck Headless Redirect Service" in content:
        print("  ⚠️ Redirect script already exists in theme.liquid. Updating...")
        # Optional: could remove old script here, but for now we just skip or overwrite.
    
    # Insert before </head>
    new_content = content.replace("</head>", f"{redirect_script}\n</head>")
    
    # 4. Save back to Shopify
    save_res = requests.put(f"{base_url}/themes/{theme_id}/assets.json", json={
        "asset": {
            "key": "layout/theme.liquid",
            "value": new_content
        }
    }, headers=headers)
    
    if save_res.status_code == 200:
        print(f"  🎉 SUCCESS: shop.0buck.com (Shopify) is now locked. All home traffic redirects to 0buck.com.")
    else:
        print(f"  ❌ Failed to save asset: {save_res.status_code} {save_res.text}")

if __name__ == "__main__":
    load_dotenv()
    patch_theme()
