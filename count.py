import sys
content = open('src/pages/AdminDashboard.tsx').read()
start = content.find('  return (\n    <main className="mx-auto max-w-[1400px]')
if start == -1:
    print("Could not find start")
    sys.exit()

sub = content[start:]
opens = sub.count('<div')
closes = sub.count('</div')

print(f"opens: {opens}, closes: {closes}")
if closes > opens:
    print(f"There are {closes - opens} too many closing divs!")
else:
    print(f"There are {opens - closes} too many opening divs!")
