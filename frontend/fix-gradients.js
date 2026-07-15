const fs = require('fs');
const file = 'src/components/ui/animated-feature-graphic.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/fill="url\(#paint(\d+)_linear_1369_66\)"/g, 'fill={`url(#paint$1_linear_${id})`}');
content = content.replace(/id="paint(\d+)_linear_1369_66"/g, 'id={`paint$1_linear_${id}`}');
content = content.replace(/clipPath="url\(#clip0_1369_66\)"/g, 'clipPath={`url(#clip0_${id})`}');
content = content.replace(/id="clip0_1369_66"/g, 'id={`clip0_${id}`}');

content = content.replace('import React from "react"', 'import React, { useId } from "react"');
content = content.replace('export function AnimatedFeatureGraphic() {', 'export function AnimatedFeatureGraphic() {\n  const id = useId();');

fs.writeFileSync(file, content);
console.log('Done!');
