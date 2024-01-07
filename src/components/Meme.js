import React from "react"

export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "https://i.imgflip.com/1w7ygt.jpg" 
    })
    const [allMemes, setAllMemes] = React.useState([])
    
    React.useEffect(() => {
        async function getMemes() {
          const res = await fetch("https://api.imgflip.com/get_memes");
          const data = await res.json();
          setAllMemes(data.data.memes);
        }
        getMemes();
      }, [])
    
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        setMeme(prevMeme => Object.assign({}, prevMeme, { randomImage: url }));
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevState => Object.assign({}, prevState, { [name]:value }))
    }

    
    const downloadMeme = async () => {      
        try {
          const response = await fetch(meme.randomImage);
          const memeBlob = await response.blob();
      
          // Create an image element for the meme
          const memeImage = document.createElement('img');
          memeImage.src = URL.createObjectURL(memeBlob);
      
          memeImage.onload = () => {
            // Create a new canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
      
            // Set canvas dimensions to match the image
            canvas.width = memeImage.width;
            canvas.height = memeImage.height;
      
            // Draw the meme image on the canvas
            ctx.drawImage(memeImage, 0, 0);
      
            // Add text to the canvas
            ctx.font = 'bold 40px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.letterSpacing = '1px';
  
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "black";
            
            ctx.fillText(meme.topText.toUpperCase(), canvas.width / 2, 70);
            ctx.fillText(meme.bottomText.toUpperCase(), canvas.width / 2, canvas.height - 40);

            // Convert canvas content to data URL
            const memeWithDataUrl = canvas.toDataURL('image/png');
      
            // Create a link to trigger download
            const link = document.createElement('a');
            link.href = memeWithDataUrl;
            const randomNumber = Math.floor(Math.random() * 10)
            link.download = `meme-${randomNumber}.png`;
            document.body.appendChild(link);
            link.click();
      
            // Clean up
            document.body.removeChild(link);
          };
        } catch (error) {
          console.error('Error downloading meme:', error);
        }
      };

    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                >
                    Get a new meme image 🖼
                </button>
            </div>
            <div className="meme">
                <img src={meme.randomImage} alt="Meme-Displayed-Here" className="meme--image" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>
            <button onClick={downloadMeme} className="download--button">Download Meme</button>
        </main>
    )
}