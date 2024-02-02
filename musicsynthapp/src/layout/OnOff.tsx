import "./OnOff.scss"

type OnOffProps = {
    value?: boolean,
}

const OnOff = (props: OnOffProps) => {

    return <button
        className={props.value ? `on-off-toggle on` : `on-off-toggle off`}>{props.value ? `on` : `off`}
    </button>
}
export default OnOff;