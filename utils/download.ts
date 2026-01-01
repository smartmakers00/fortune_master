
export function downloadResultAsHtml(title: string, content: string) {
  // Simple markdown conversion for basic tags in the downloaded file
  const formattedContent = content
    .replace(/^# (.*$)/gim, '<h1 style="color: #fde68a; font-family: \'Noto Serif KR\', serif; font-size: 2em; margin-bottom: 20px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #fbbf24; font-family: \'Noto Serif KR\', serif; font-size: 1.5em; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 5px;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #f59e0b; font-family: \'Noto Serif KR\', serif; font-size: 1.25em; margin-top: 20px; margin-bottom: 10px;">$1</h3>')
    .replace(/^\* (.*$)/gim, '<li style="margin-bottom: 8px;">$1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin-bottom: 8px;">$1</li>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin-bottom: 15px; line-height: 1.8;">')
    .replace(/\n/g, '<br/>');

  const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 결과지</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Noto Sans KR', sans-serif; 
            background-color: #0c0a09; 
            color: #d6d3d1; 
            display: flex; 
            justify-content: center; 
            padding: 40px 20px;
            margin: 0;
        }
        .card { 
            max-width: 800px; 
            width: 100%; 
            background: #1c1917; 
            border: 1px solid #292524; 
            border-radius: 24px; 
            padding: 50px; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.6); 
        }
        .gold-text { 
            background: linear-gradient(to bottom, #fde68a, #d97706); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent;
            font-family: 'Noto Serif KR', serif;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #444;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }
        .content {
            font-size: 1.1em;
        }
        .footer {
            margin-top: 60px; 
            text-align: center; 
            color: #57534e; 
            font-size: 0.85em;
            border-top: 1px solid #292524;
            padding-top: 20px;
        }
        strong { color: #fde68a; }
        ul { padding-left: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1 class="gold-text" style="margin: 0; font-size: 2.5em;">${title}</h1>
            <p style="color: #78716c; margin-top: 10px;">2026 병오년 신년 운세 결과지</p>
        </div>
        <div class="content">
            <p style="margin-bottom: 15px; line-height: 1.8;">${formattedContent}</p>
        </div>
        <div class="footer">
            <p>© 2026 Fortune Master AI. 본 문서는 AI에 의해 생성된 분석 결과입니다.</p>
        </div>
    </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}_2026_운세.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
