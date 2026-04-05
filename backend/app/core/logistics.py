from typing import Dict, List, Optional

# 0Buck Partner Freight Forwarder Warehouses (合作货代仓)
# Strategically placed in major industrial hubs.
WAREHOUSES = [
    {
        "id": "wh_humen",
        "name": "Humen Cloud Warehouse (Dongguan)",
        "province": "Guangdong",
        "city": "Dongguan",
        "description": "Primary hub for Electronics & Garments."
    },
    {
        "id": "wh_yiwu",
        "name": "Yiwu Digital Hub (Zhejiang)",
        "province": "Zhejiang",
        "city": "Yiwu",
        "description": "Small Commodities & Fast Moving Goods."
    },
    {
        "id": "wh_qingdao",
        "name": "Qingdao Maritime Warehouse (Shandong)",
        "province": "Shandong",
        "city": "Qingdao",
        "description": "Heavy machinery and northern industrial products."
    },
    {
        "id": "wh_shanghai",
        "name": "Shanghai Free Trade Hub",
        "province": "Shanghai",
        "city": "Shanghai",
        "description": "High-end tech and global transit."
    }
]

def find_closest_warehouse(province: str, city: Optional[str] = None) -> Dict:
    """
    Simple province-based matching for logistics anchors.
    In the future, this can be expanded with coordinate-based distance calculation.
    """
    # 1. Direct province match
    for wh in WAREHOUSES:
        if wh["province"] == province:
            return wh
            
    # 2. Regional fallback (South China -> Humen)
    south_china = ["Guangdong", "Guangxi", "Fujian", "Hainan"]
    if province in south_china:
        return WAREHOUSES[0] # Humen
        
    # 3. East China -> Yiwu or Shanghai
    east_china = ["Zhejiang", "Jiangsu", "Anhui", "Jiangxi"]
    if province in east_china:
        return WAREHOUSES[1] # Yiwu
        
    # 4. North/Northeast China -> Qingdao
    north_china = ["Shandong", "Hebei", "Henan", "Liaoning", "Jilin", "Heilongjiang", "Beijing", "Tianjin"]
    if province in north_china:
        return WAREHOUSES[2] # Qingdao
        
    # 5. Default to the most versatile hub (Shanghai)
    return WAREHOUSES[3]
