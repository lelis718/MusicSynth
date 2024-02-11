import { QwertyHancock } from "qwerty-hancock";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../engine/AppProvider";

type KeyboardProps = {
  destination: string;
};

const Keyboard = (props: KeyboardProps) => {
    const { dispatch } = useContext(AppContext);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = ref.current?.id;
    console.log("Criando teclado");
    const keys = new QwertyHancock({ id: id, width:960, height:70, octaves:6, startNote:"A1" });
    keys.keyDown = (key, frequency) => {
        dispatch({ actionName:"START", synthId:props.destination, nodeInstanceId: key, settingsOverride:{"frequency":frequency} })
      console.log("Key", key);
      console.log("Frequency", frequency);
    };
    keys.keyUp = (key) => {
        dispatch({ actionName:"STOP", nodeInstanceId: key })
    }
  }, []);

  return (
    <div className="keyboardControl">
      <div ref={ref} id="keyboard"></div>
    </div>
  );
};
export default Keyboard;
