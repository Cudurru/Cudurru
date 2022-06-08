import React, {useState, useEffect} from 'react';

import '../../components/Input.scss'
import './FilterDropDown.scss'

export default function FilterDropDown(props){

    const submitQuery = () => {
        props.submitQuery();        
    }
    const handleChange = (target) => {
        let filterObject = {...props.filterObject};
        // console.log(target.value)
        // console.log(filterObject.max)
        // console.log(parseInt(target.value)>parseInt(filterObject.max))
        // if(target.name === "min"){
        //     if ((filterObject.max === "") || (parseInt(target.value) > parseInt(filterObject.max))){
        //         filterObject.max = target.value
        //     }
        // }
        // if(target.name === "max"){
        //     if (parseInt(target.value) < parseInt(filterObject.min)){
        //         filterObject.min = target.value
        //     }
        // }
        if(parseInt(target.value) > parseInt(props.filterObject.maxValue)){
            target.value = props.filterObject.maxValue
        }
        if(parseInt(target.value) < parseInt(props.filterObject.minValue)){
            target.value = props.filterObject.minValue
        }

        filterObject[target.name] = target.value;
        defineOperation(filterObject);
        props.handleAttributeChange(filterObject);
    }
    function defineOperation(filterObject){
        if(filterObject.min !== ""){
            if(filterObject.max !== ""){
                filterObject.operator = "range";
                filterObject.apply = true;
            }
            else{
                filterObject.operator="ge";
                filterObject.apply = true;
            }
        }
        else {
            if(filterObject.max !== ""){
                filterObject.operator = "le";
                filterObject.apply = true;
            }
            else {
                filterObject.operator = "";
                filterObject.apply = false;
            }
        }
    }
    const resetObject = () => {
        let filterObject = {...props.filterObject};
        filterObject.apply = false;
        filterObject.max = "";
        filterObject.min = "";
        filterObject.operator = "";
        props.handleAttributeChange(filterObject);
        submitQuery();
    }
    // console.log(props.filterObject.minValue)
    // console.log(props.filterObject.maxValue)
    return(
        <div className="filter-dropdown">
            {/* {props.filterObject.apply ? "apply" : ""} */}
            <div className="dropdown-inputs input">
                <input
                    type="number"
                    className="filter-input-range number-input"
                    value={props.filterObject.min}
                    onChange={(e)=> handleChange(e.target)}
                    onBlur={(e) => submitQuery()}
                    placeholder="Min"
                    min={props.filterObject.minValue}
                    max={props.filterObject.maxValue}
                    name="min"
                    step={props.filterObject.step}
                />
                <input
                    type="number"
                    className="filter-input-range number-input"
                    value={props.filterObject.max}
                    onChange={(e)=>handleChange(e.target)}
                    onBlur={(e) => submitQuery()}
                    placeholder="Max"
                    min={props.filterObject.minValue}
                    max={props.filterObject.maxValue}
                    name="max"
                    step={props.filterObject.step}
                />
            </div>
            <div className="action-buttons">
                <button className="button-text" onClick={()=>resetObject()}>Reset</button>
                <button className="button-primary" onClick={()=>{submitQuery(); props.handleApplyButtonClick();}}>Apply</button>
            </div>
        </div>
    )



}
