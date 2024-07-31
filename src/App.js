import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [textOptions, setTextOptions] = useState({
    text: "BANNER",
    font: "Ghost",
    horizontallayout: "default",
    verticallayout: "default",
    width: 200,
    whitespaceBreak: false,
  });

  const Layouts = ["default", "fitted", "full", "controlled smushing", "universal smushing"];
  const [newText, setNewText] = useState("");
  const [fonts, setFonts] = useState([]);

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
        url: "http://localhost:8000",
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
  }, [textOptions]);

  useEffect(() => {
    GetFonts();
    convert(textOptions)
  }, []);

  const convert = async (textOptions) => {
    try {
      const res = await axios({
        url: "http://localhost:8000/convertText",
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

  return (
    <div style={{ height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
        <button onClick={() => convert(textOptions)}>Convert</button>
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
        <select defaultValue={textOptions.whitespaceBreak} name="whitespaceBreak" onChange={handleSpaceChange} >
          <option value="On">On</option>
          <option value="Off">Off</option>

        </select>
      </div>

      <div style={{ backgroundColor: "black", color: 'white', padding: 15 }}>

        <pre>{newText}</pre>


      </div>

    </div>
  );
}

export default App;
