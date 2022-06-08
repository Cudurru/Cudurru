
import React, {useState, useEffect} from 'react';
import QueryFilters from "./QueryFilters";
import PropertiesList from "./PropertiesList";
import { processResponse } from '../../middleware';
import {useWindowSize} from '../../utils/utils';
import { API_URL } from '../../vars.js';

import './BrowseHomes.scss';


/* This component will be responsible for fetching the property list from the backend */
export default function BrowseHomes(props){
    const [propertiesEndPoint, setPropertiesEndPoint] = useState(API_URL + "/api/properties");
    const [fullPropertiesList, setFullPropertiesList] = useState([]);
    const [rawFilterList, setRawFilterList] = useState([]);
    const [paginationString, setPaginationString] = useState('0:1000');
    const [orderByString, setOrderByString] = useState("askingPrice:asc");
    const windowSize = useWindowSize();
    /* rawFilters is a filter list in the format:
       ['fieldName:operator:value', 'yearBuilt:ge:1900', 'askingPrice:le:20000'] */
    const updateFilterList = (rawFilters) => {
        setRawFilterList(rawFilters);
    }

    const buildFilterQueryArgs = () => {
        let queryArgs = "";
        rawFilterList.map((rawFilter, index) => {
            queryArgs = queryArgs + "filters=" + rawFilter
            queryArgs += "&"
        })
        return queryArgs;
    }

    const buildPaginationQueryArgs = () => {
        let queryArgs = "";
        queryArgs = "pagination=" + paginationString + "&"
        return queryArgs;
    }
    const buildOrderByQueryArgs = () => {
        let queryArgs = "";
        queryArgs = "orderBy=" + orderByString
        return queryArgs;
    }
    useEffect(() => {
        // console.log(fullPropertiesList);
    }, [fullPropertiesList])
    useEffect(()=>{
        queryProperties();
    }, [rawFilterList, paginationString, orderByString])

    async function queryProperties(){
        let jwt = await localStorage.getItem('jwt');
        let filterString = buildFilterQueryArgs();
        let paginationString = buildPaginationQueryArgs();
        let orderByString = buildOrderByQueryArgs();
        // console.log(filterString);
        fetch(propertiesEndPoint + '?' + filterString + paginationString + orderByString, {
            method: 'GET',            
            headers: {
                Accept: 'application/json',
                'Authorization': 'Bearer: ' + jwt,
            },
        }).then(processResponse)
        .then(
            res => {
                const {statusCode, data} = res;
                console.log(res);
                if(statusCode === 200){
                    setFullPropertiesList(data.properties);
                }
            }
        )
    }

    /* pagination is a string in the format:
       'page:per_page'
     */
    const updatePagination = (pagination) => {
        setPaginationString(pagination);
    }
    
    /* orderBy is a string in the format:
       'fieldName:method' method is asc or desc
     */
    const updateOrderBy = (orderBy) => {
        setOrderByString(orderBy);
    }

    return(
        <div className="browse-homes-content">
            <QueryFilters 
                updateFilterList={updateFilterList}
                updatePagination={updatePagination}
                
                breakpoint={windowSize.breakpoint}
            />
            <PropertiesList 
                updateOrderBy={updateOrderBy}
                foundPrefix="Found "
                foundSuffix=""
                orderBy={orderByString}
                fullPropertiesList={fullPropertiesList}
                breakpoint={windowSize.breakpoint}
            />
        </div>
    )
}