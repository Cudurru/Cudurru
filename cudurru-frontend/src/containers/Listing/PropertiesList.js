import React, {useState, useEffect} from 'react'

import PropertyNonDetailed from './PropertyNonDetailed';

import ReactPaginate from 'react-paginate';

import './PropertiesList.scss';
// Breakpoints
// Mobile <= 576 px
// tablet-mobile-up >= 577, <= 767
// tablet-up  >= 768, <= 991
// tablet-landscape-up >= 992, <= 1199
// desktop >= 1200
export default function PropertiesList (props) {
    // console.log(props.fullPropertiesList)
    const [paginationInfo, setPaginationInfo] = useState({perPage: 24, page: 1})

    const [reactPaginateObject, setReactPaginateObject] = useState({
        mobile: {marginPagesDisplayed:1, pageRangeDisplayed:1},
        tablet_mobile_up : {marginPagesDisplayed:1, pageRangeDisplayed:7},
        tablet_up: {marginPagesDisplayed:1, pageRangeDisplayed: 11},
        tablet_landscape_up: {marginPagesDisplayed:1, pageRangeDisplayed:17},
        desktop: {marginPagesDisplayed:1, pageRangeDisplayed:21},
    });
    const [orderBy, setOrderBy] = useState(props.orderBy);
    // const orderByDict = {
    //     askingPriceAsc: "askingPrice:asc",
    //     askingPriceDesc: "askingPrice:desc",
    //     listedDateAsc: "listedDate:asc",
    //     listedDateDesc: "listedDate:desc",
    // };

    useEffect(()=>{
        if(props.updateOrderBy){
            props.updateOrderBy(orderBy);
        }
    }, [orderBy]);//So that every time orderBy changes, this gets called.

    const handleOrderByChange = (e) => {
        setOrderBy(e.target.value);
    }

    const renderOrderBy = () => {
        if(props.orderBy){
            return (
                <div className="order-by-container">               
                    <select 
                        className="order-by-dropdown" 
                        value={orderBy} 
                        onChange={handleOrderByChange}
                    >
                        <option className="order-by-option" value="askingPrice:asc">Price (Low to High)</option>
                        <option className="order-by-option" value="askingPrice:desc">Price (High to Low)</option>
                        <option className="order-by-option" value="listedDate:desc">New Listings First</option>
                        <option className="order-by-option" value="listedDate:asc">Old Listings First</option>
                    </select>
                </div>
            )
        }
        else {
            return ""
        }
    }

    const calculateNumberOfPages = () =>{
        let totalProperties = props.fullPropertiesList.length;
        if (totalProperties === 0){
            return 1;
        }
        return Math.ceil(totalProperties/paginationInfo.perPage);
    }
    const pageChange = (data) => {
        let selected = data.selected;
        let pagination = {...paginationInfo};
        pagination.page = selected + 1;
        setPaginationInfo(pagination);
    }
    let pagesList = []
    for(let i = 1; i<=calculateNumberOfPages(); i++){
        pagesList.push(i);
    }

    const indexOfLastAsset = paginationInfo.page * paginationInfo.perPage;
    const indexOfFirstAsset = indexOfLastAsset - paginationInfo.perPage;

    let paginatedProperties = props.fullPropertiesList.slice(indexOfFirstAsset, indexOfLastAsset);

    let paginateObject = reactPaginateObject[props.breakpoint];

    return(

        <div className="properties-list">
            <div className="properties-list-header">
                <h2 className="found-items">{props.foundPrefix}{props.fullPropertiesList.length} properties{props.foundSuffix}.</h2>
                {renderOrderBy()}
            </div>            
            <div className="property-results">
                <h4 className="properties-number">{`${paginatedProperties.length ? `Showing ${indexOfFirstAsset + 1} - ${paginatedProperties.length + indexOfFirstAsset}`: ""}`}</h4>
                <div className="properties">
                    {paginatedProperties.map((propertyObject, index) => {
                        return(
                            <PropertyNonDetailed
                                propertyObject={propertyObject}
                                deleteButton={props.deleteButton}
                            />
                        )
                    })}
                </div>            
            </div>  
            <ReactPaginate
                previousLabel={'<'}
                nextLabel=">"
                breakLabel="..."
                pageCount={calculateNumberOfPages()}
                marginPagesDisplayed={paginateObject.marginPagesDisplayed}
                pageRangeDisplayed={paginateObject.pageRangeDisplayed}
                onPageChange={pageChange}
                containerClassName='pagination'
                pageLinkClassName="page-link"
                nextLinkClassName="page-link"
                previousLinkClassName="page-link"
                breakLinkClassName="page-link"
                breakClassName="page-item"
                pageClassName="page-item"
                previousClassName="page-item"
                nextClassName="page-item"
                subContainerClassName='pages pagination'
                activeClassName="active"
            />

        </div>
    )



}