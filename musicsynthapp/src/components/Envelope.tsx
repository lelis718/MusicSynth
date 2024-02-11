import { useContext, useState } from "react";
import { AppContext, useFetching } from "../engine/AppProvider";
import { EnvelopeSettings } from "../engine/SynthEnvelope";
import Knob from "../layout/Knob";

type EnvelopeProps = {
  id: string;
  name?: string;
  settings?: EnvelopeSettings;
  destination?: string;
};
export function Envelope(props: EnvelopeProps) {
  const [settings, setSettings] = useState<EnvelopeSettings>(
    props.settings ?? { attack: 0.02, sustain: 0.85, decay: 0.1, release: 0.06 }
  );
  const { state, dispatch } = useContext(AppContext);
  const { id } = props;

  useFetching({
    actionName: "REGISTER_ENVELOPE",
    synthId: props.id,
    settings: settings,
  });

  const change = (newvalue: any, id: string) => {
    const newSettings = { ...settings, [id]: newvalue };
    setSettings(newSettings);
    dispatch({
      actionName: "CHANGE_ENVELOPE_SETTINGS",
      synthId: props.id,
      settings: newSettings,
    });
  };

  return (
    <div className="control">
      <div className="header">
        <h3>{props.name ?? "Envelope"}</h3>
      </div>
      <div>
        <Knob
          name="attack"
          value={settings.attack}
          from={0}
          to={0.5}
          onValueChange={(value) => change(value, "attack")}
        ></Knob>
        <Knob
          name="sustain"
          value={settings.sustain}
          from={0}
          to={1}
          onValueChange={(value) => change(value, "sustain")}
        ></Knob>
        <Knob
          name="decay"
          value={settings.decay}
          from={0}
          to={0.5}
          onValueChange={(value) => change(value, "decay")}
        ></Knob>
        <Knob
          name="release"
          value={settings.release}
          from={0}
          to={0.5}
          onValueChange={(value) => change(value, "release")}
        ></Knob>
      </div>
    </div>
  );
}
