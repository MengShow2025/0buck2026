import json
from typing import Any, List, Optional, Tuple


def _add_image(out: List[str], value: Any) -> None:
    if not value:
        return
    if isinstance(value, str):
        s = value.strip()
        if s.startswith('[') and s.endswith(']'):
            try:
                parsed = json.loads(s)
                _add_image(out, parsed)
                return
            except Exception:
                pass
        if s and s not in out:
            out.append(s)
        return

    if isinstance(value, list):
        for item in value:
            _add_image(out, item)
        return

    if isinstance(value, dict):
        for k in ("url", "image", "img", "src", "bigImage", "productImage"):
            if k in value:
                _add_image(out, value.get(k))
                return


def extract_cj_images(raw: Any) -> List[str]:
    if not isinstance(raw, dict):
        return []

    out: List[str] = []

    for k in (
        "productImage",
        "productImageList",
        "productImageSet",
        "images",
        "imageList",
        "productImages",
        "mainImage",
        "bigImage",
        "smallImage",
        "productImageUrl",
    ):
        if k in raw:
            _add_image(out, raw.get(k))

    return out


def first_image(images: List[str]) -> str:
    return images[0] if images else ""


def _parse_float(value: Any) -> Optional[float]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        s = value.strip()
        if not s:
            return None
        try:
            return float(s)
        except Exception:
            return None
    return None


def extract_cj_weights(raw: Any) -> Tuple[Optional[float], Optional[float]]:
    if not isinstance(raw, dict):
        return None, None
    packing = _parse_float(raw.get("packingWeight"))
    product = _parse_float(raw.get("productWeight"))
    if packing is None and product is None and isinstance(raw.get("variants"), list) and raw.get("variants"):
        v0 = raw.get("variants")[0]
        if isinstance(v0, dict):
            packing = _parse_float(v0.get("variantWeight"))
    return packing, product


def _dims_from_variant(v: Any) -> Optional[Tuple[float, float, float]]:
    if not isinstance(v, dict):
        return None
    l = _parse_float(v.get("variantLength"))
    w = _parse_float(v.get("variantWidth"))
    h = _parse_float(v.get("variantHeight"))
    if l and w and h:
        return l, w, h

    standard = v.get("variantStandard")
    if isinstance(standard, str) and standard:
        parts = {}
        for chunk in standard.split(','):
            if '=' not in chunk:
                continue
            k, vv = chunk.split('=', 1)
            parts[k.strip()] = vv.strip()
        l = _parse_float(parts.get('long'))
        w = _parse_float(parts.get('width'))
        h = _parse_float(parts.get('height'))
        if l and w and h:
            return l, w, h
    return None


def extract_cj_dimensions(raw: Any) -> Optional[Tuple[float, float, float]]:
    if not isinstance(raw, dict):
        return None
    variants = raw.get("variants")
    if isinstance(variants, list) and variants:
        dims = _dims_from_variant(variants[0])
        if dims:
            return dims
    return None


def format_dimensions_cm(dims: Optional[Tuple[float, float, float]]) -> Optional[str]:
    if not dims:
        return None
    l, w, h = dims
    if max(l, w, h) >= 100:
        l, w, h = l / 10.0, w / 10.0, h / 10.0
    l_s = f"{l:.1f}".rstrip('0').rstrip('.')
    w_s = f"{w:.1f}".rstrip('0').rstrip('.')
    h_s = f"{h:.1f}".rstrip('0').rstrip('.')
    return f"{l_s}x{w_s}x{h_s} cm"


def format_weight_g(packing: Optional[float], product: Optional[float]) -> Optional[str]:
    v = packing if packing is not None else product
    if v is None:
        return None
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return f"{s} g"


def extract_cj_warehouse_data(inventory_data: Any) -> Tuple[str, int]:
    """
    v8.0 Truth Protocol: Extract best warehouse anchor and total stock.
    Returns: (anchor_string, total_stock)
    """
    if not isinstance(inventory_data, dict):
        return "CN", 0
        
    inventories = inventory_data.get('inventories', [])
    anchors = []
    total_stock = 0
    
    for inv in inventories:
        country = inv.get('countryCode', '').upper()
        stock = inv.get('totalInventoryNum', 0)
        total_stock += stock
        if stock > 0 and country:
            anchors.append(country)
            
    if not anchors:
        return "CN", 0
        
    # Standardize: US and EU countries take priority for 0Buck
    unique_anchors = list(set(anchors))
    return ", ".join(unique_anchors), total_stock
