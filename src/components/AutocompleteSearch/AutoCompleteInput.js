import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { selectLocation } from "../../actions";
import PropTypes from "prop-types";
import "./AutocompleteStyle.scss";
import { POPULAR_DESTINATIONS } from "../../constant";
import { ALL_DESTINATIONS } from "../../constant";
import csrfAPI from "../../apis/csrfAPI";

function AutoCompleteInput(props) {
  const [value, setValue] = React.useState("");
  const [isQuery, setQueryParams] = React.useState(false);
  const [dropDownData, setDropDownData] = React.useState();
  const [destinationCount, setDestinationCount] = React.useState(props.autocompleteLabel);
  const [openParentIndex, setOpenParentIndex] = useState(null);
  const allCheckedValueRef = useRef({
    destination: [],
    region_group: [],
    region: [],
    resort: [],
  });
  let AllCheckedcount

  useEffect(() => {
    if (props.placeholder && !isQuery) {
      setValue(decodeURI(props.placeholder));
      setQueryParams(true);
    }
  },[isQuery]);

  const handleChange = event => {
    let userInputValue = event.target.value;
    setValue(userInputValue);

    if(checkLength && value.length > props.searchConstraint){
      if (document.querySelector(".autocomplete-dropdown1"))
      document.querySelector(".autocomplete-dropdown1").style.display = "block";
    }else{
      if (document.querySelector(".autocomplete-dropdown-new"))
      document.querySelector(".autocomplete-dropdown-new").style.display = "block";
      //document.querySelector(".autocomplete-dropdown").style.display = "none";
    }
    // event.target.value.length > 2 &&
    //   props.asyncOnChange(event.target.value.toLowerCase());
    if(event.target.value.length > 0){
      props.asyncOnChange(event.target.value.toLowerCase());
      document.querySelector(".search-button").setAttribute('data-value', event.target.value.toLowerCase());
    }else {
      props.asyncOnChange("");
      document.querySelector(".search-button").setAttribute('data-value', "");
    }
  };

  const destinationClick = () => {
    document.querySelector(".search-button").setAttribute('data-value', '0');
  };

  const destinationSearch = term => {
    if (term.identifier === "resort") {
      props.selectLocation({ resorts: term.label });
    } else if (term.identifier === "region") {
      props.selectLocation({ region: term.label });
    } else if (term.identifier === "region_group") {
      props.selectLocation({ region_group: term.label });
    } else if (term.identifier === "destination") {
      props.selectLocation({ destination: term.label });
    }
  };

  let checkLength =
    (Object.keys(props.responsevilla).length ||
      props.responsedestination.length) > 0;

  const determineLocation = data => {

    props.onAutoCompleteKeyup("")
    props.setIsButtonClickable(true);

    switch (data.type) {
      case "destination":
        props.selectLocation({ destination: data.label });
        break;
      case "region":
        props.selectLocation({ region: data.label });
        break;
      case "location":
        props.selectLocation({ location: data.label });
        break;
    }
  };

  const fetchLabel = term => {
    if (term.identifier === "destination") {
      return `${term.label}`;
    } else if (term.identifier === "region_group") {
      return `${term.label}`;
    } else {
      return `${term.label}, ${term.area}`;
    }
  };

  useEffect(() => {
    if (window.drupalSettings.node_type.length) {
      let nodeTitle = window.drupalSettings.node_title;
      switch (window.drupalSettings.node_type) {
        case "resort":
          setValue(nodeTitle);
          props.selectLocation({ resorts: nodeTitle });
          break;
        case "region":
          setValue(nodeTitle);
          props.selectLocation({ region: nodeTitle });
          break;
        case "region_group":
          setValue(nodeTitle);
          props.selectLocation({ region_group: nodeTitle });
          break;
        case "destination":
          setValue(nodeTitle);
          props.selectLocation({ destination: nodeTitle });
          break;
      }
    }
  }, []);

  useEffect(() => {
    csrfAPI
    .get(`/api/solm_affiliate_menu_items/rest-menu-items?max_depth=6`)
    .then((response) => {
      if(response){
        setDropDownData(response.data)
      }
    })
    .catch((e) => console.log(e));
  }, [])

  const handleHideSelf = ()=>{
    if(document.querySelector('.autocomplete-dropdown-new')) {
      document.querySelector('.autocomplete-dropdown-new').style.display = "none";
    }
  }
 
function findParentTags(arr, targetTitle, parentTitle = null, subparentTitle = null, parentTag = null, subparentTag = null) {
  for (let i = 0; i < arr.length; i++) {
    const currentTitle = arr[i].title;
    const currentTag = arr[i].options.attributes.tag;

    if (currentTitle === targetTitle) {
      const parentObject = { title: parentTitle, tag: parentTag };
      const subparentObject = { title: subparentTitle, tag: subparentTag };
      return [parentObject, subparentObject];
    }

    if (arr[i].below && arr[i].below.length > 0) {
      const result = findParentTags(arr[i].below, targetTitle, currentTitle, parentTitle, currentTag, parentTag);
      if (result) return result;
    }
  }

  return null;
}

function getChildElementByTitle(json, title) {
  for (let i = 0; i < json.length; i++) {
    const element = json[i];
    if (element.title === title) return element;
    if (element.below && element.below.length > 0) {
      const childElement = getChildElementByTitle(element.below, title);
      if (childElement) return childElement;
    }
  }
  return null;
}

function arrayContainsAll(arrayValues, subsetValues) {
  for (let i = 0; i < subsetValues.length; i++) {
    if (!arrayValues.includes(subsetValues[i])) return false;
  }
  return true;
}
function removeValuesContainingWord(array, word) {
  return array.filter(value => {
    for (let i = 0; i < word.length; i++) {
      if (value.includes(word[i])) {
        return false;
      }
    }
    return true;
  });
}
const handleDestinationReset = ()=>{
  allCheckedValueRef.current.region = []
  allCheckedValueRef.current.region_group = []
  allCheckedValueRef.current.destination = []
  allCheckedValueRef.current.resort = []
  AllCheckedcount = ''
  document.querySelector(".autocomplete-dropdown-new").style.display = "none";
  props.selectLocation({});
  setDestinationCount(props.autocompleteLabel)
};
const handleCheckboxChange = (e, dropDownData1) => {
  let regionArray = [];
  let resortArray = [];
  let regionGrpArray = [];
  document.querySelector('.block-custom-search .search-button').removeAttribute('disabled', 'disabled');
  props.setIsButtonClickable(true);
  e.stopPropagation();
  const { value, checked } = e.target;
  const tag = e.target.getAttribute('dataTag');
  const result = findParentTags(dropDownData, value);

  const updateAllCheckedValues = (data) => {
    const value = data.title;
    const tag = data.options.attributes.tag;

    allCheckedValueRef.current = {
      ...allCheckedValueRef.current,
      [tag]: checked ? [...allCheckedValueRef.current[tag], value] : allCheckedValueRef.current[tag].filter((e) => e !== value),
    };

    if (checked) {
      const titleToSearch = e.target.getAttribute('parentValue');
      const ParenTag = e.target.getAttribute('ParenTag');
      const SearchData = getChildElementByTitle(dropDownData, titleToSearch);
      if (SearchData && SearchData.title == titleToSearch) {
        if (SearchData.below) {
          SearchData.below.forEach((val) => {
            const value = val.title;
            if(val.options.attributes.tag == "resort"){
              resortArray.push(value)
            }else{
              regionArray.push(value);
            }
          });
        }
        if (arrayContainsAll(allCheckedValueRef.current["region"], regionArray) || arrayContainsAll(allCheckedValueRef.current["region_group"], regionArray )  || (arrayContainsAll(allCheckedValueRef.current["resort"], resortArray) && arrayContainsAll(allCheckedValueRef.current["region"], regionArray))) {
          if (ParenTag) {
            allCheckedValueRef.current = {
              ...allCheckedValueRef.current,
              [ParenTag]: [...allCheckedValueRef.current[ParenTag], titleToSearch],
            };
          }
        }
      }

      dropDownData.forEach((valdesti) => {
        const destnation = valdesti.title;
        if (valdesti.below && destnation === result[1].title) {
          valdesti.below.forEach((valregGrp) => {
            const regionGroup = valregGrp.title;
            regionGrpArray.push(regionGroup);
          });
        }
      });

      if (arrayContainsAll(allCheckedValueRef.current["region_group"], regionGrpArray)) {
        const title = result[1].title;
        const tag = result[1].tag;
        if (tag) {
          allCheckedValueRef.current = {
            ...allCheckedValueRef.current,
            [tag]: [...allCheckedValueRef.current[tag], title],
          };
        }
      }
    } else {
      const result = findParentTags(dropDownData, value);
      result.forEach((val) => {
        const value = val.title;
        const tag = val.tag;
        if (tag) {
          allCheckedValueRef.current = {
            ...allCheckedValueRef.current,
            [tag]: allCheckedValueRef.current[tag].filter((e) => e !== value),
          };
        }
      });
    }

    if (data.below) {
      data.below.forEach((element) => {
        updateAllCheckedValues(element);
        if (element.below) {
          element.below.forEach((child) => {
            updateAllCheckedValues(child);
          });
        }
      });
    }
  };

  updateAllCheckedValues(dropDownData1);
  allCheckedValueRef.current.region = [...new Set(allCheckedValueRef.current.region)];
  allCheckedValueRef.current.region_group = [...new Set(allCheckedValueRef.current.region_group)];
  allCheckedValueRef.current.destination = [...new Set(allCheckedValueRef.current.destination)];
  allCheckedValueRef.current.resort = [...new Set(allCheckedValueRef.current.resort)];
  AllCheckedcount = allCheckedValueRef.current.destination.length + allCheckedValueRef.current.region.length + allCheckedValueRef.current.region_group.length;
  props.selectLocation(allCheckedValueRef);
  setDestinationCount(`${AllCheckedcount} Destinations selected`);
};

const handleClick = () => {
  if (
    document.querySelector(".duration-item-dropdown").style.display == "block"
  )
    document.querySelector(".duration-item-dropdown").style.display = "none";
};

const Menu = ({ dropDownData1, indexparam, propIndex = 0, parent }) => {
  const handleChildChange = (e, parentIndex) => {
    e.stopPropagation();
    setOpenParentIndex(parentIndex === openParentIndex ? null : parentIndex);
  };

  if (dropDownData1) {
    return (
      <ul className={`parent-dropDown ${indexparam} ${propIndex === 0 ? "hasParent" : "hasChild"}`}>
        {dropDownData1.map((item, index) => (
          <li key={item.title} className={`dropDown dropDown-${propIndex}-${index} ${index === openParentIndex ? "open" : ""}`}>
            <div>
              <label className={item.options.attributes.tag}>
                <input
                  type="checkbox"
                  name={item.options.attributes.tag}
                  value={item.title}
                  dataTag={item.options.attributes.tag}
                  onClick={(e) => handleCheckboxChange(e, item)}
                  parentValue={parent ? parent.title : "main Parent"}
                  ParenTag={parent ? parent.options.attributes.tag : "main Parent"}
                  id={`dropDown_${item.title}`}
                  checked={allCheckedValueRef.current[item.options.attributes.tag]?.includes(item.title)}
                />
                <span className={item.options.attributes.tag}>{item.title}</span>{" "}
              </label>{" "}
              {item.below && (
                <button className="active" id="custom_button_close" onClick={(e) => handleChildChange(e, index)}>
                </button>
              )}
            </div>
            {item.below && <Menu dropDownData1={item.below} propIndex={propIndex + 1} indexparam={item.options.attributes.tag} parent={item} />}
          </li>
        ))}
      </ul>
    );
  }
};

  let autocompleteDropDown = document.querySelector(".autocomplete-dropdown");
  return (
    <React.Fragment>
      <div className="autocomplete-container autocomplete-container1 location-container search-input-container solmar-dropdown-container">
        <label htmlFor="destination-search">Destination</label>
        <input
          className="input"
          type="text"
          value={value}
          name={props.name}
          onFocus={props.handlefocus}
          onChange={handleChange}
          placeholder={destinationCount}
          onClick={handleClick}
          autoComplete="off"
          id="destination-search"
          onKeyUp={ (e)=>{

            if(e.target.value.length){
             props.setIsButtonClickable(false);
             document.querySelector('.block-custom-search .search-button').setAttribute('disabled','disabled');
            }else{
              props.setIsButtonClickable(true);
            }

            if(props.onAutoCompleteKeyup){
              props.onAutoCompleteKeyup(e)
            }else{
              console.log("props.onAutoCompleteKeyup NOT FOUND");
            }
          } }
        />
        {checkLength && value.length > props.searchConstraint ? (
          <div
            className="autocomplete-dropdown location-dropdown search-input-dropdown solmar-dropdown"
            style={{ display: "none" }}
            onClick={destinationClick}
          >
            {
              <ol className="solmar-dropdown-inner">
                {props.responsedestination.length > 0 && (
                  <li>
                    Destination
                    <ol>
                      {props.responsedestination &&
                        props.responsedestination.map((d, i) => (
                          <li
                            key={i}
                            data-key={d}
                            identifier-key={d.identifier}
                            onClick={() => {
                              setValue(d.label), destinationSearch(d);
                              determineLocation(d);
                              document.querySelector('.block-custom-search .search-button').removeAttribute('disabled','disabled');
                              autocompleteDropDown.style.display = "none";
                            }}
                          >
                            {/* {d.label}, {d.area} */}
                            {fetchLabel(d)}
                          </li>
                        ))}
                    </ol>
                  </li>
                )}
                {Object.keys(props.responsevilla).length > 0 && (
                  <li>
                    Villas
                    <ol>
                      {props.responsevilla &&
                        props.responsevilla.map((d, i) => (
                          <li
                            key={i}
                            data-key={d}
                            onClick={() => {
                              setValue(d.label);
                              determineLocation(d);
                              document.querySelector('.block-custom-search .search-button').removeAttribute('disabled','disabled');
                              props.selectLocation({ villa_name: d });
                              autocompleteDropDown.style.display = "none";
                            }}
                          >
                            {d.label}
                          </li>
                        ))}
                    </ol>
                  </li>
                )}
              </ol>
            }
          </div>
        ) : (
          <div
            className="autocomplete-dropdown-new location-dropdown search-input-dropdown solmar-dropdown"
            style={{ display: "none" }}
            onClick={destinationClick}
          >
            {/* {
              <ol className="solmar-dropdown-inner">
                {POPULAR_DESTINATIONS.length > 0 && (
                  <li>
                    <span className="secondary-color">
                      Popular Destinations
                    </span>
                    <ol>
                      {POPULAR_DESTINATIONS.map((d, i) => (
                        <li
                          key={i}
                          data-key={d}
                          onClick={() => {
                            setValue(d.label);
                            determineLocation(d);
                            autocompleteDropDown.style.display = "none";
                          }}
                        >
                          {d.label}
                        </li>
                      ))}
                    </ol>
                  </li>
                )}

                {ALL_DESTINATIONS.length > 0 && (
                  <li>
                    <span className="secondary-color">
                      All Destinations
                    </span>
                    <ol>
                      {ALL_DESTINATIONS.map((d, i) => (
                        <li
                          key={i}
                          data-key={d}
                          onClick={() => {
                            setValue(d.label);
                            determineLocation(d);
                            autocompleteDropDown.style.display = "none";
                          }}
                        >
                          {d.label}
                        </li>
                      ))}

                      <li>
                        <a href="/destinations">Browse All Destinations</a>
                      </li>

                    </ol>
                  </li>
                )}
              </ol>
            } */}
            {dropDownData &&(
              <>
                <h3>All Destinations</h3>
                <div className="close-btn hide-for-medium desti" onClick={handleHideSelf}><img src={window.drupalSettings.base_url+"/themes/custom/solm/images/close-button.svg"}/></div>
                <Menu dropDownData1={dropDownData}/>
                <span className="destinations-reset" onClick={handleDestinationReset}>Reset</span>
              </>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

AutoCompleteInput.propTypes = {
  name: PropTypes.string,
  asyncOnChange: PropTypes.func
};

AutoCompleteInput.defaultProps = {
  name: "autocomplete",
  response: []
};

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, {
  selectLocation
})(AutoCompleteInput);
