import React, {useState, useEffect, useRef} from 'react'
import FilterDropDown from './FilterDropDown'

import {humanNumbers} from '../../utils/utils';

import '../../components/Button.scss'
import './SimpleFilterInput.scss'

const NOOP = "";

export default function SimpleFilterInput (props) {
    const filterNameObject = {
        squareFootage: {
            longName: "Square Footage",
            shortName: "ft²:",
            addition: "",
            convert: true,
        },
        bedroomCount: {
            longName: "Bedrooms",
            shortName: "Beds:",
            addition: "",
            convert: true,
        },
        bathroomCount: {
            longName: "Bathrooms",
            shortName: "Baths:",
            addition: "",
            convert: true,
        },
        yearBuilt: {
            longName: "Year Built",
            shortName: "Year:",
            addition: "",
            convert: false,
        },
        askingPrice: {
            longName: "Price",
            shortName: "",
            addition: "$",
            convert: true,
        },
    }
    const container = useRef(null);
    const [open, setOpen] = useState(false);

    const getButtonName = () =>{
        let filterObj = props.activeFilterObject;
        let filterName = filterNameObject[filterObj.fieldName];
        let convert = filterName.convert
        // console.log(filterObj);
        if(filterObj.operator === NOOP){
            return filterName.longName
        }
        else{
            if(filterObj.operator === "ge"){
                return filterName.shortName + " " + filterName.addition + humanNumbers(filterObj.min, convert) + "+";
            }
            if(filterObj.operator === "le"){
                return filterName.shortName + " up to " + filterName.addition + humanNumbers(filterObj.max, convert);
            }
            if(filterObj.operator === "range"){
                return filterName.shortName + " " + filterName.addition + humanNumbers(filterObj.min, convert) + " to " + filterName.addition + humanNumbers(filterObj.max, convert);
            }
        }
    }
    useEffect(() => {
        const onMouseUp = (e) => {
            if(container.current && !container.current.contains(e.target)){
                setOpen(false);
            }
        };
        window.addEventListener('mouseup', onMouseUp);
        return () => {
          window.removeEventListener('mouseup', onMouseUp);
        }
      }, []);

    const handleFilterButtonClick = () => {
        setOpen(!open);
    }
    const handleApplyButtonClick = () => {
        setOpen(false);
    }
    return (
        <div className="filter" ref={container}>
            <button type="button" className={`button-secondary ${props.activeFilterObject.active ? "filter-button-applied" : ""}`} onClick={handleFilterButtonClick}>
                {getButtonName()}
            </button>
            {open ?
                <FilterDropDown
                submitQuery={props.submitQuery}
                filterObject={props.filterObject}
                handleAttributeChange={props.handleAttributeChange}
                handleApplyButtonClick={handleApplyButtonClick}
                />
                : ''
            }
        </div>
    )

    // function RenderOptionList(props){

    //     return (
    //         <React.Fragment>
    //             <option className="filter-operator-option" value={null}>All</option>
    //             <option className="filter-operator-option" value="eq">Equal to</option>
    //             <option className="filter-operator-option" value="gt">Greater than</option>
    //             <option className="filter-operator-option" value="ge">Greater or Equal to</option>
    //             <option className="filter-operator-option" value="lt">Less than</option>
    //             <option className="filter-operator-option" value="le">Less or Equal to</option>
    //         </React.Fragment>
    //     )
    // }

    // if(props.filterObject.operator === "range"){
    //     return(
    //         <React.Fragment>
    //             <label>{filterNameObject[props.filterObject.fieldName] + " Filter"}</label>
    //             <select
    //                 value={props.filterObject.operator}
    //                 className="filter-operator-select"
    //                 onChange={(e) => props.attributeHandler(e.target)}
    //                 name={props.filterObject.fieldName}
    //             >
    //                 <opt
    //             </select>
    //         </React.Fragment>
    //     )
    // }

}