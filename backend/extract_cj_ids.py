import ast
import json

def extract_categories(data):
    cats = {}
    if isinstance(data, list):
        for item in data:
            cats.update(extract_categories(item))
    elif isinstance(data, dict):
        # The structure is nested: categoryFirstList -> categorySecondList -> categoryThirdList
        # Or sometimes just categoryName/categoryId at some level
        name = data.get('categoryName') or data.get('categoryFirstName') or data.get('categorySecondName')
        cid = data.get('categoryId') or data.get('categoryFirstId') or data.get('categorySecondId')
        if name and cid:
            cats[name] = cid
        for key in ['categoryFirstList', 'categorySecondList', 'categoryThirdList', 'data']:
            if key in data:
                cats.update(extract_categories(data[key]))
    return cats

try:
    with open('cj_cats.json', 'r') as f:
        content = f.read()
        lines = content.split('\n')
        if len(lines) >= 2:
            # Line 2 is the string representation of the dict
            data = ast.literal_eval(lines[1])
            all_cats = extract_categories(data)
            
            targets = ['Pet Supplies', 'Home Improvement', 'Cooler', 'Fan', 'Gadgets']
            found = {}
            # Flatten all categories first
            def get_all(data):
                res = {}
                if isinstance(data, list):
                    for x in data: res.update(get_all(x))
                elif isinstance(data, dict):
                    n = data.get('categoryName') or data.get('categoryFirstName') or data.get('categorySecondName')
                    c = data.get('categoryId') or data.get('categoryFirstId') or data.get('categorySecondId')
                    if n and c: res[n] = c
                    for k in ['categoryFirstList', 'categorySecondList', 'categoryThirdList', 'data', 'list', 'content']:
                        if k in data: res.update(get_all(data[k]))
                return res
            
            all_cats = get_all(data)
            for t in targets:
                found[t] = all_cats.get(t)
                if not found[t]:
                    for name, cid in all_cats.items():
                        if t.lower() in name.lower():
                            found[t] = cid
                            break
            print(json.dumps(found, indent=2))
except Exception as e:
    import traceback
    traceback.print_exc()

