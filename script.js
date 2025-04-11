const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const captionText = document.getElementById('captionText');

const memeTemplates = [
  'https://i.imgflip.com/1bij.jpg',
  'https://i.imgflip.com/26am.jpg',
  'https://i.imgflip.com/2fm6x.jpg',
  'https://i.imgflip.com/30b1gx.jpg'
];

generateBtn.addEventListener('click', async () => {
  const prompt = document.getElementById('memePrompt').value;
  if (!prompt) return alert("Please enter a meme scenario first!");

  const memeUrl = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
  const caption = await getFunnyCaption(prompt);

  captionText.innerText = "😂 " + caption;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    ctx.font = "bold 40px Impact";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";

    ctx.fillText(caption, canvas.width / 2, canvas.height - 40);
    ctx.strokeText(caption, canvas.width / 2, canvas.height - 40);
  };
  img.src = memeUrl;
});

async function getFunnyCaption(prompt) {
  try {
    const response = await fetch('/api/generateCaption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      console.error('API Error:', await response.text());
      return "😅 Server overloaded or error occurred!";
    }

    const data = await response.json();
    return data.caption?.trim() || "😂 Couldn't think of a caption!";
  } catch (error) {
    console.error('Fetch error:', error);
    return "🚨 Network or server issue!";
  }
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'ai-meme.png';
  link.href = canvas.toDataURL();
  link.click();
});
