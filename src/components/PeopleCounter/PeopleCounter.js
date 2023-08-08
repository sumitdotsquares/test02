import React, { useState } from "react";
import {connect} from 'react-redux';
import {selectPassenger} from '../../actions';

const PeopleCounter = (props) => {
  let [peopleCount, setpeopleCount] = useState(Number(props.placeholder.adults) ||2);
  let [infantCount, setinfantCount] = useState(Number(props.placeholder.infants) ||0);
  let [inputValue, setinputValue] = useState("");
  let [peopleLimit, setPeopleLimit] = useState(false);

  const changeValue = (adults,infants) => {
    let inputdata = `${adults + infants} People`;
    if(!(infants <=2*adults) ){
      setPeopleLimit(true);
    }else{
      setPeopleLimit(false);
    }
    setinputValue(inputdata);
  };
  
  return (
    <div className="popover-container peoplecounter-container search-input-container solmar-dropdown-container">
      <label htmlFor="people-search">People</label>
      <input
        type="text"
        className="input false-readonly"
        onFocus={props.handlefocus}
        value={inputValue}
        onChange={changeValue}
        placeholder={props.placeholder.adults?`${Number(props.placeholder.adults) + Number(props.placeholder.infants)} People`:`${peopleCount + infantCount} People`}
        id="people-search"
        readOnly={true}
      />
  
        <div className="popover-dropdown peoplecounter-dropdown search-input-dropdown solmar-dropdown"  style={{display:"none"}}>
          <div className="solmar-dropdown-inner">
            <div className="people-counter-item">
              <b>Adults/Children:</b> <span className="people-counter-item-amount">{peopleCount}</span>
              <button disabled={peopleCount<=1}
                onClick={() => {
                  peopleCount > 1 && peopleCount--;
                  setpeopleCount(peopleCount);
                  if(infantCount >= 2*peopleCount){
                    setinfantCount(peopleCount*2);
                    props.selectPassenger({"adults":peopleCount,"infants":peopleCount*2});
                    changeValue(peopleCount, peopleCount*2);
                  }else{
                    props.selectPassenger({"adults":peopleCount,"infants":infantCount});
                    changeValue(peopleCount,infantCount);
                  }
                }}
              >
                -
              </button>
              <button disabled={peopleCount>24}
                onClick={() => {
                  peopleCount < 25 && peopleCount++;
                  setpeopleCount(peopleCount);
                  props.selectPassenger({"adults":peopleCount,"infants":infantCount});
                  changeValue(peopleCount,infantCount);
                }}
              >
                +
              </button>
            </div>
            <div className="people-counter-item">
              <b>Infants (under 2):</b> <span className="people-counter-item-amount">{infantCount}</span>
              <button disabled={infantCount<1}
                onClick={() => {
                  infantCount > 0 && infantCount--;
                  setinfantCount(infantCount);
                  props.selectPassenger({"adults":peopleCount,"infants":infantCount});
                  changeValue(peopleCount,infantCount);
                }}
              >
                -
              </button>
              <button disabled={infantCount>9 || (infantCount >= 2*peopleCount)}
                onClick={() => {
                  infantCount < 10 && infantCount++;
                  setinfantCount(infantCount);
                  props.selectPassenger({"adults":peopleCount,"infants":infantCount});
                  changeValue(peopleCount,infantCount);
                }}
              >
                +
              </button>
            </div>
          </div>
          {/* {peopleLimit && (<div>Max 2 Infants per Person</div>)} */}
        </div>
      
    </div>
  );
};

const mapStateToProps = state =>{
  return {placeholder: state.placeholder};
}

export default connect(mapStateToProps,{selectPassenger})(PeopleCounter);
