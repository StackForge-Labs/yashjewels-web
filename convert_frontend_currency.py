import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. formatVnd definition and calls
    content = content.replace('formatVnd', 'formatUsd')
    
    # 2. Intl.NumberFormat
    content = content.replace('"vi-VN"', '"en-US"')
    content = content.replace("'vi-VN'", "'en-US'")
    
    # 3. Currency codes
    content = content.replace('"VND"', '"USD"')
    content = content.replace("'VND'", "'USD'")
    content = content.replace(' VND', ' USD') # Handle text like "100.000 VND"
    
    # 4. Symbol
    content = content.replace(' ₫', ' $')
    content = content.replace('"₫"', '"$"')
    content = content.replace("'₫'", "'$'")
    
    # 5. Fix some specific patterns like "VND per gram"
    content = content.replace('VND per gram', 'USD per gram')
    content = content.replace('VND/gm', 'USD/gm')
    
    # 6. Specific to price warning/drift (VND values are usually millions)
    # If we see 5.000.000 or 10.000.000 in placeholders/logic
    content = content.replace('5000000', '500')
    content = content.replace('10000000', '1000')
    content = content.replace('100000000', '10000')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

src_dir = 'src'
count = 0
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
            filepath = os.path.join(root, file)
            if process_file(filepath):
                count += 1

print(f"Processed {count} files.")
