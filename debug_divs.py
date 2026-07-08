import re

content = open('src/pages/AdminDashboard.tsx').read()
start = content.find('  return (\n    <main')
sub = content[start:]

stack = []
opens = [m.start() for m in re.finditer(r'<div\b[^>]*>', sub)]
closes = [m.start() for m in re.finditer(r'</div\s*>', sub)]

events = [(pos, 1) for pos in opens] + [(pos, -1) for pos in closes]
events.sort()

depth = 0
for pos, kind in events:
    depth += kind

print(f"Final depth: {depth}")
