import React, {useState, useEffect} from 'react';
import Autocomplete from 'react-google-autocomplete';
import { Accordion } from 'react-bootstrap'
import SimpleFilterInput from './SimpleFilterInput';

import '../../components/Button.scss';
import '../../components/Input.scss';

import './QueryFilters.scss';

const SEPARATOR = ":";
const NOOP = "";

export default function QueryOptionsHomes(props){
    const [distanceFilterObject, setDistanceFilterObject] = useState({radius: "50", latitude: "", operator: "", longitude: "", fieldName: "geo", step: 5, minValue: "0", maxValue: "300000"})
    const [squareFootageFilterObject, setSquareFootageFilterObject] = useState({fieldName: "squareFootage", operator: "", min: "", max: "", step:100, minValue:"0", maxValue:"10000000"});
    const [bedroomCountFilterObject, setBedroomCountFilterObject] = useState({fieldName: "bedroomCount", operator: "", min: "", max: "", step:1, minValue:"0", maxValue:"999"});
    const [bathroomCountFilterObject, setBathroomCountFilterObject] = useState({fieldName: "bathroomCount", operator: "", min: "", max: "", step:0.5, minValue:"0", maxValue:"999"});
    const [yearBuiltFilterObject, setYearBuiltFilterObject] = useState({fieldName: "yearBuilt", operator: "", min: "", max: "", step:1, minValue:"0", maxValue:"2030"});
    const [askingPriceFilterObject, setAskingPriceFilterObject] = useState({fieldName: "askingPrice", operator: "", min: "", max: "", step:50000, minValue: "0", maxValue:"100000000"});
    const [queryCount, setQueryCount] = useState(0);
    // Active filters object are only updated when the filters are built (the query is run)
    const [activeFiltersObject, setActiveFiltersObject] = useState({
        geo: {
            selected: false,
            ...distanceFilterObject
        },
        squareFootage: {
            selected: false,
            ...squareFootageFilterObject
        },
        bedroomCount: {
            selected: false,
            ...bedroomCountFilterObject
        },
        bathroomCount: {
            selected: false,
            ...bathroomCountFilterObject
        },
        yearBuilt: {
            selected: false,
            ...yearBuiltFilterObject
        },
        askingPrice: {
            selected: false,
            ...askingPriceFilterObject
        },
    });

    useEffect(()=>{
        if(props.distanceFilter){
            setDistanceFilterObject(props.distanceFilter)
        }
    }, [])

    useEffect(() => {
        // Build filters only when the queryCount state is updated
        buildFilters();
    }, [queryCount])

    const submitQuery = () => {
        // setting query count makes the filters be built.
        setQueryCount(queryCount + 1);
    }
    const buildFilters = () => {
        let rawFilterList = [];
        let activeFilters = {...activeFiltersObject};
        let filterObjectList = [
            {...squareFootageFilterObject},
            {...bedroomCountFilterObject},
            {...bathroomCountFilterObject},
            {...yearBuiltFilterObject},
            {...askingPriceFilterObject}]

        // console.log(distanceFilterObject.operator);
        let distanceFilterString = NOOP
        activeFilters[distanceFilterObject.fieldName] = {...distanceFilterObject};
        if((distanceFilterObject.operator !== NOOP) && (distanceFilterObject.longitude !== NOOP)){
            distanceFilterString = distanceFilterObject.fieldName + SEPARATOR + distanceFilterObject.longitude + SEPARATOR + distanceFilterObject.latitude + SEPARATOR + parseInt(distanceFilterObject.radius) * 1600
            // console.log(distanceFilterString);
            rawFilterList.push(distanceFilterString);
            activeFilters[distanceFilterObject.fieldName].active = true;
        }
        else {
            activeFilters[distanceFilterObject.fieldName].active = false;
        }

        filterObjectList.map((filterObj, index) => {
            activeFilters[filterObj.fieldName] = {...filterObj};
            if(filterObj.operator !== NOOP){
                let filterString = NOOP;
                if(filterObj.operator === "range"){
                    filterString = filterObj.fieldName + SEPARATOR + filterObj.operator + SEPARATOR + filterObj.min + SEPARATOR + filterObj.max
                }
                if(filterObj.operator === "ge"){
                    filterString = filterObj.fieldName + SEPARATOR + filterObj.operator + SEPARATOR + filterObj.min
                }
                if(filterObj.operator === "le"){
                    filterString = filterObj.fieldName + SEPARATOR + filterObj.operator + SEPARATOR + filterObj.max
                }
                if(filterString !== NOOP){
                    // if filterString is not NOOP, push it to the rawFilterList, and set activeObject.active to true.
                    activeFilters[filterObj.fieldName].active = true;
                    rawFilterList.push(filterString);
                }
            }
            else {
                // if filterObj.operator is NOOP, the filter is not active.
                activeFilters[filterObj.fieldName].active = false;
            }
        })

        // console.log(rawFilterList);
        setActiveFiltersObject(activeFilters);
        props.updateFilterList(rawFilterList);
    }

    function handleRadiusChange(value){
        let distanceFilter = {...distanceFilterObject};
        if (value !== NOOP && distanceFilter.longitude !== NOOP){
            distanceFilter.operator = 'active';
        }
        else {
            distanceFilter.operator = NOOP
        }
        distanceFilter.radius = value;
        setDistanceFilterObject(distanceFilter);
        submitQuery();
    }

    function handleLocationChange(longitude, latitude) {
        let distanceFilter = {...distanceFilterObject};
        distanceFilter.latitude = latitude;
        distanceFilter.longitude = longitude;

        if(longitude !== NOOP){
            distanceFilter.operator = 'active';
        }
        else {
            distanceFilter.operator = NOOP;
        }
        setDistanceFilterObject(distanceFilter);
        submitQuery();
    }

    function characteristicsButtons() {
        return (
            <div className="filters-characteristics--content">
                <SimpleFilterInput
                    submitQuery={submitQuery}
                    activeFilterObject={activeFiltersObject["squareFootage"]}
                    handleAttributeChange={handleSquareFootageChange}
                    filterObject={squareFootageFilterObject}
                />
                <SimpleFilterInput
                    submitQuery={submitQuery}
                    activeFilterObject={activeFiltersObject["bedroomCount"]}
                    handleAttributeChange={handleBedroomCountChange}
                    filterObject={bedroomCountFilterObject}
                />
                <SimpleFilterInput
                    submitQuery={submitQuery}
                    activeFilterObject={activeFiltersObject["bathroomCount"]}
                    handleAttributeChange={handleBathroomCountChange}
                    filterObject={bathroomCountFilterObject}
                />
                <SimpleFilterInput
                    submitQuery={submitQuery}
                    activeFilterObject={activeFiltersObject["yearBuilt"]}
                    handleAttributeChange={handleYearBuiltChange}
                    filterObject={yearBuiltFilterObject}
                />
                <SimpleFilterInput
                    submitQuery={submitQuery}
                    activeFilterObject={activeFiltersObject["askingPrice"]}
                    handleAttributeChange={handleAskingPriceChange}
                    filterObject={askingPriceFilterObject}
                />
            </div>
        )
    }
    const handleSquareFootageChange = (squareFootageFilter) => setSquareFootageFilterObject(squareFootageFilter);
    const handleBedroomCountChange = (bedroomCountFilter) => setBedroomCountFilterObject(bedroomCountFilter);
    const handleBathroomCountChange = (bathroomCountFilter) => setBathroomCountFilterObject(bathroomCountFilter);
    const handleYearBuiltChange = (yearBuiltFilter) => setYearBuiltFilterObject(yearBuiltFilter);
    const handleAskingPriceChange = (askingPriceFilter) => setAskingPriceFilterObject(askingPriceFilter);

    return (
            <div className="filters">
                <div className="filters-location">
                    <div className="input">
                        <label className="input-label">Enter origin search location</label>
                        <Autocomplete
                            className="filter-input--origin-address"
                            onPlaceSelected={(place) => {
                                // console.log(place);
                                if(place.geometry){
                                    let longitude = place.geometry.location.lng();
                                    let latitude = place.geometry.location.lat();
                                    // console.log(longitude);
                                    // console.log(latitude);
                                    handleLocationChange(longitude, latitude);
                                }
                                else{
                                    handleLocationChange(NOOP,NOOP);
                                }
                            }}
                            types={['address']}
                            componentRestrictions={{country: "us"}}
                            className="text-input"
                        />
                    </div>
                    <div className="filter-input--radius input">
                        <label className="input-label">Radius (miles)</label>
                        <input
                            className="number-input"
                            type="number"
                            value={distanceFilterObject.radius}
                            step={distanceFilterObject.step}
                            min={0}
                            max={500}
                            onChange={(e) => handleRadiusChange(e.target.value)}/>
                    </div>
                </div>
                <div className="filters-characteristics--mobile">
                    <Accordion>
                        <Accordion.Toggle className="button-secondary" eventKey="1">More filters</Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">{characteristicsButtons()}</Accordion.Collapse>
                    </Accordion>
                </div>
                <div className="filters-characteristics--desktop">
                    {characteristicsButtons()}
                </div>
            </div>
    )
}