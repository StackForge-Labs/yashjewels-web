import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Capitalized variations
    content = content.replace('formatVND', 'formatUSD')
    content = content.replace('(VND)', '(USD)')
    content = content.replace('VND)', 'USD)')
    content = content.replace('VND ', 'USD ')
    content = content.replace(' VND', ' USD')
    content = content.replace('VND/', 'USD/')
    content = content.replace('VND', 'USD')
    content = content.replace('₫', '$')
    content = content.replace('vi-VN', 'en-US')

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
