// const { useState, useEffect } = require("react");
// const { __esModule } = require("react-google-autocomplete");
import React, {useState, useEffect} from 'react';

function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }
  function humanNumbers(bytes, convert,dp=1) {
    const thresh =  1000;
  
    if (!convert || (Math.abs(bytes) < thresh)) {
      return bytes + '';
    }
  
    const units = ['K', 'M', 'B', 'T', 'Q', 'Qi', 'Sx'] ;
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + '' + units[u];
  }
  function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      breakpoint: 'mobile',
    });
    // Handler to call on window resize
    
  
    useEffect(() => {
      const handleResize = () => {
        // Set window width/height to state
        let width = window.innerWidth;
        let breakpoint = "mobile";
        if (width >= 577 && width <= 767){
            breakpoint = "tablet_mobile_up"
        }
        else if(width >= 768 && width <= 991){
            breakpoint = "tablet_up"
        }
        else if(width >= 992 && width <= 1199) {
            breakpoint = "tablet_landscape_up"
        }
        else if( width >= 1200){
            breakpoint = "desktop"
        }
        setWindowSize({
          breakpoint: breakpoint,
        });
      }
      
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
  
    return windowSize;
  }

  module.exports = {
    useWindowSize: useWindowSize,
    humanFileSize: humanFileSize, 
    humanNumbers: humanNumbers};