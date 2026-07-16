import type { RowLabelProps } from "@payloadcms/ui";
import type { ArrayFieldServerProps } from "payload";

// const OptionRowLabel = (
//     props: { rowLabel: string } & ArrayFieldServerProps & RowLabelProps
// ) => {

//     if (!props.siblingData.options?.length) {
//         return <p>{props.rowLabel}</p>;
//     }
    
//     const optionValue = props.siblingData.options
//         .map((option: any) => option.value)
//         .filter((option: any) => option);

//     if (optionValue.length === 0) {
//         return <p>{props.rowLabel}</p>;
//     }

//     return <p>{optionValue.join(" / ")}</p>; 
// };

const OptionRowLabel = (
    props: { rowLabel: string } & ArrayFieldServerProps & RowLabelProps
) => {

    if (!props.siblingData.options?.length) {
        return <p>{props.rowLabel}</p>;
    } 

    const currentRow = props.siblingData.options[((props.rowNumber as number) -1)]

    if(!currentRow.value || !currentRow.option){
        return <p>{props.rowLabel}</p>; 
    } 

    return <p>{[currentRow.option, currentRow.value].filter(i => !!i).join(': ') || props.rowLabel}</p>
};

export default OptionRowLabel;
