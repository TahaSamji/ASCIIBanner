import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';

function App() {
  const [textOptions, setTextOptions] = useState({
    text: "BANNER",
    font: "Ghost",
    horizontallayout: "default",
    verticallayout: "default",
    width: 200,
    whitespaceBreak: false,
  });
  const [color, setColor] = useColor("#000000");
  const [fgcolor, setfgColor] = useColor("#ffffff");
  const [ChoosebgColor, SetChoosebgColor] = useState(false);
  const [ChoosefgColor, SetChoosefgColor] = useState(false);
  const [fontSize, setfontSize] = useState(15);


  const handlebgColorPick = function () {
    SetChoosebgColor(true);
    SetChoosefgColor(false);
  }
  const handleClose = function () {
    SetChoosebgColor(false);
    SetChoosefgColor(false);
  }

  const handlefgColorPick = function () {
    SetChoosefgColor(true);
    SetChoosebgColor(false);
  }
  const Layouts = ["default", "fitted", "full", "controlled smushing", "universal smushing"];
  const [newText, setNewText] = useState("");
  const [fonts, setFonts] = useState([]);
  const DivRef = useRef();


  const handleSpaceChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value)
    if (value === "On") {
      setTextOptions((prev) => ({
        ...prev,
        [name]: true
      }));
    } else if (value === "Off") {
      setTextOptions((prev) => ({
        ...prev,
        [name]: false
      }));
    }


  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(value)
    setTextOptions((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const GetFonts = async () => {
    try {
      const res = await axios({
        url: "https://ascii-banner-backend-murex.vercel.app",
        // url: "http://localhost:8000",
        method: "get",
      });
      if (res.data.data) {
        console.log(res.data.data);
        setFonts(res.data.data);
        return;
      }
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };
  useEffect(() => {
    console.log(textOptions);
    convert(textOptions);
  }, [textOptions]);

  useEffect(() => {
    console.log(color);
  }, [color]);

  useEffect(() => {
    console.log(DivRef.current.offsetHeight, fontSize)

  }, [textOptions, fontSize]);

  useEffect(() => {
    GetFonts();
    convert(textOptions);
  }, []);


  const convert = async (textOptions) => {
    try {
      const res = await axios({
        url: "https://ascii-banner-backend-murex.vercel.app/convertText",
        // url: "http://localhost:8000/convertText",
        method: "post",
        data: { textOptions }
      });

      if (res.data.data) {
        console.log(res.data.data);
        setNewText(res.data.data);
      }
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  const handleCaptureClick = async () => {
    if (DivRef) {
      const canvas = await html2canvas(DivRef.current);
      const dataURL = canvas.toDataURL('image/png');
      downloadjs(dataURL, 'download.png', 'image/png');
    }
  };
 

  // const handleDownload = () => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const dataURL = canvas.toDataURL("image/png");
  //     const a = document.createElement('a');
  //     a.href = dataURL;
  //     a.download = 'EnlargedImage.png';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   }
  // }; 


  return (
    <div style={{ width: "100vw", height: "100vh", overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>ASCII BANNER GENERATOR</h1>
        <div style={{ marginBottom: 20 }}>
          fonts: <select defaultValue={textOptions.font} name="font" onChange={handleChange} >
            <option value="" disabled>Select an option</option>
            <option value={textOptions.font} >Ghost</option>
            {fonts.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          Text:<input defaultValue={textOptions.text} name='text' value={textOptions.text} onChange={handleChange} type='text' style={{ marginRight: 10, marginLeft: 10 }} />

        </div>
        <div style={{ marginBottom: 15 }}>
          Horizontal Layout:
          <select defaultValue={textOptions.horizontallayout} name="horizontallayout" onChange={handleChange} style={{ marginRight: 10, marginLeft: 10 }}  >
            {Layouts.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          Vertical Layout:
          <select defaultValue={textOptions.verticallayout} name="verticallayout" onChange={handleChange} >
            {Layouts.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 15 }}>
          width:
          <input type='number' defaultValue={textOptions.width} name="width" onChange={handleChange} style={{ marginRight: 20 }} >
          </input>
          WhiteSpaceBreak:
          <select style={{marginRight:10}} defaultValue={textOptions.whitespaceBreak} name="whitespaceBreak" onChange={handleSpaceChange} >
            <option value="On">On</option>
            <option value="Off">Off</option>
          </select>
     

          Font size : <input type='number' defaultValue={fontSize} name="imgheight" onChange={(e) => setfontSize(Number(e.target.value))} style={{ marginRight: 20, marginBottom: 20 }} >

          </input>
      
        </div>
        <div style={{ marginBottom: 20 }}>
          Select Background Color : <button onClick={() => handlebgColorPick()}>Pick</button>
        </div>
        <div style={{ marginBottom: 20 }}>
          Select Foreground Color : <button onClick={() => handlefgColorPick()}>Pick</button>
        </div>
        {(ChoosebgColor || ChoosefgColor) && <div style={{ marginBottom: 20 }}>
          Close color picker : <button onClick={() => handleClose()}>close</button>
        </div>}

        {/* {ChooseColor && <ColorPicker hideInput color={color} onChange={setColor} />} */}

        <div style={{ display: 'flex' }}>
          <div>
            <div style={{ marginRight: 20, display: 'flex' }}>
              {ChoosebgColor && <h4 style={{ marginRight: 10 }}>Picking Background Color : </h4>}
              {ChoosefgColor && <h4 style={{ marginRight: 10 }}> Picking Foreground Color : </h4>}
              {ChoosebgColor && <ColorPicker hideInput={["rgb", "hsv"]} color={color} onChange={setColor} />}
              {ChoosefgColor && <ColorPicker hideInput={["rgb", "hsv"]} color={fgcolor} onChange={setfgColor} />}
            </div>
          </div>
          <div>
            <div className="Mybanner" ref={DivRef} style={{ backgroundColor: color.hex, color: fgcolor.hex, padding: 15}}>
              <pre style={{fontSize:fontSize}} >{newText}</pre>
            </div>
          </div>
        </div>
        <div>
         <button style={{marginTop:10}}onClick={() => handleCaptureClick()}>Download</button>
        </div>

      </div>
    </div>
  );
}

export default App;
