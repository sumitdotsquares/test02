import React, { useRef, useState } from "react";
import AutoCompleteInput from "./AutocompleteSearch/AutoCompleteInput";
import PeopleCounter from "./PeopleCounter/PeopleCounter";
import axios from "axios";
import { connect } from "react-redux";
import "./SearchbarStyle.scss";
import DatePickerContainer from "./Datepicker/DatePickerContainer";
// import FlightSearch from "./FlightSearch/FlightSearch";
import utils from "./utils/utils";
import QUERIES from "../queries";
import {
  selectLocation,
  fetchPlaceholder,
  selectPassenger,
  getDate,
  noDates,
  resetDates,
  getDuration,
} from "../actions";
import DurationInput from "./DurationBox/DurationInput";
import csrfAPI from "../apis/csrfAPI";

const SearchBar = (props) => {
  const [popover, setPopover] = useState({
    autocomplete: true,
    datepicker: true,
    people: true,
    flight: false,
  });
  const closepopover = {
    autocomplete: false,
    datepicker: false,
    people: false,
    flight: false,
  };
  let autocompleteRef = useRef();
  let datepickerRef = useRef();
  let peopleRef = useRef();
  let flightRef = useRef();
  let searchRef = useRef();
  let [villas, setvillas] = React.useState([]);
  let [affiliateGlobal, setAffiliateGlobal] = React.useState([]);
  let partnar_logo = window.drupalSettings.partnar_logo;
  let [destination, setdestination] = React.useState([]);

  let [message, setMessage] = React.useState("");
  let [disabled, setDisabled] = React.useState(false);
  let [isButtonClickable, setIsButtonClickable] = React.useState(true);

  const changeTitle = (value) => {
    if (value.length === 0) {
      let mobileMessageSearch = document.getElementById("mobileMessageSearch");
      mobileMessageSearch.innerText = "";
    } else {
      let showTitle = document.querySelector("#SearchBarDisabled");
      showTitle.setAttribute(
        "title",
        "Please select a destination or villa from the available options"
      );
      function isMobileDevice() {
        return (
          typeof window.orientation !== "undefined" ||
          navigator.userAgent.indexOf("IEMobile") !== -1
        );
      }
      if (isMobileDevice()) {
        // Touch event to show the title attribute value
        let showTitle = document.querySelector("#SearchBarDisabled");
        showTitle.addEventListener("touchstart", function () {
          showTitle.setAttribute(
            "title",
            "Please select a destination or villa from the available options"
          );
          if (document.querySelector("#SearchBarDisabled").disabled) {
            let mobileMessageSearch = document.getElementById(
              "mobileMessageSearch"
            );
            mobileMessageSearch.innerText =
              "Please select a destination or villa from the available options";
            function automaticHide() {
              mobileMessageSearch.innerText = "";
            }
            setMessage("");
            // Set the timeout for 3 seconds (2000 milliseconds)
            setTimeout(automaticHide, 2000);
          }
        });
      }
      //setMessage("Please select a destination or villa from the available options");
    }
  };

  const changeDisabled = (value) => {
    if (value.length === 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const getresult = (value) => {
    if (value.length) {
      props.selectLocation({ query: value });
    } else {
      props.selectLocation({});
    }
    axios
      .post(
        // `${process.env.SOLMAR_ES_ENDPOINT}/${process.env.SOLMAR_ES_INDEX_NAME}/_search?size=256`,
        `${drupalSettings.es_url}/_search?size=256`,
        QUERIES.query(value),
        {
          // auth: {
          //   username: `${process.env.SOLMAR_ES_USER}`,
          //   password: `${process.env.SOLMAR_ES_PASSCODE}`
          // },
        }
      )
      .then(({ data }) => {
        let response = getResponse(data.hits.hits, value);
        if (Object.keys(response).length && value.length > 2) {
          setvillas(response.vl_title);
          setdestination([
            ...response.des_info,
            ...response.rt_info,
            ...response.rn_info,
            ...response.rn_group_info,
          ]);
        } else {
          setvillas([]);
          setdestination([]);
        }
      });
  };

  let [placeholderText, setPlaceholderText] = React.useState(
    "Destination / Villa"
  );

  const handleAutoOnfocus = () => {
    if (document.querySelector(".autocomplete-dropdown-new"))
      document.querySelector(".autocomplete-dropdown-new").style.display =
        "block";
    setPlaceholderText("Select from list or type to search");
  };

  const handleDatepickerOnfocus = () => {
    if (document.querySelector(".datepicker-dropdown"))
      //document.querySelector(".autocomplete-dropdown-new").style.display = "none";
      document.querySelector(".duration-item-dropdown").style.display = "none";
    document.querySelector(".datepicker-dropdown").style.display = "block";
    if (document.querySelector(".autocomplete-dropdown-new")) {
      document.querySelector(".autocomplete-dropdown-new").style.display =
        "none";
    }
  };

  const handlePeopleOnfocus = () => {
    if (document.querySelector(".popover-dropdown"))
      //document.querySelector(".autocomplete-dropdown-new").style.display = "none";
      document.querySelector(".duration-item-dropdown").style.display = "none";
    document.querySelector(".popover-dropdown").style.display = "block";
    if (document.querySelector(".autocomplete-dropdown-new")) {
      document.querySelector(".autocomplete-dropdown-new").style.display =
        "none";
    }
  };

  // const handleflightOnfocus = () => {
  //   document.querySelector(".flight-dropdown")?.style?.display = "block";
  // };

  const preserveQuery = (query) => {
    Object.keys(query).forEach((d) => {
      switch (d) {
        case "villa_name":
          props.selectLocation({ villa_name: query[d] });
        case "destination":
          props.selectLocation({ destination: query[d] });
          break;
        case "resorts":
          props.selectLocation({ resorts: query[d] });
          break;
        case "region":
          props.selectLocation({ region: query[d] });
          break;
        case "region_group":
          props.selectLocation({ region_group: query[d] });
          break;
        case "location":
          props.selectLocation({ location: query[d] });
          break;
        case "query":
          props.selectLocation({ query: query[d] });
          break;
        case "start_date":
          props.getDate({
            start_date: query["start_date"],
            end_date: query["end_date"],
          });
          break;
        case "duration":
          props.getDuration({
            duration: query[d],
          });

          break;
        case "yearMonth":
          props.getDate({
            yearMonth: query["yearMonth"],
          });
          break;
        // case "flight":
        //   props.selectAirport({ flight: query[d] });
        // break;
        case "adults":
          props.selectPassenger({
            adults: query["adults"],
            infants: query["infants"],
          });
          break;
      }
    });
  };

  React.useEffect(() => {
    let datepicker = document.querySelector(".datepicker");
    let autocomplete = document.querySelector(".autocomplete");
    let people = document.querySelector(".peoplecounter");
    let input = document.querySelector("#input");
    // let flight = document.querySelector(".flight");
    let searchBar = document.querySelector(".autocomplete-container");
    let durationDropnDown = document.querySelector(".duration-dropdown");
    document.addEventListener("click", function (event) {
      if (
        !durationDropnDown.contains(event.target) &&
        document.querySelector(".solmar-dropdown")
      ) {
        if (
          event.target.tagName !== "INPUT" &&
          event.target.type !== "checkbox" &&
          event.target.id !== "duration_box"
        ) {
          document.querySelector(".solmar-dropdown-main-search").style.display =
            "none";
        }
      }

      if (
        !datepicker.contains(event.target) &&
        document.querySelector(".datepicker-dropdown")
      ) {
        document.querySelector(".datepicker-dropdown").style.display = "none";
      }
      if (
        input.contains(event.target) &&
        document.querySelector(".datepicker-dropdown")
      ) {
        //document.querySelector(".datepicker-dropdown").style.display = "none";
      }
      if (
        !autocomplete.contains(event.target) &&
        !searchBar.contains(event.target) &&
        document.querySelector(".autocomplete-dropdown")
      ) {
        document.querySelector(".autocomplete-dropdown").style.display = "none";
        setPlaceholderText("Destination / Villa");
      }
      if (
        !autocomplete.contains(event.target) &&
        !searchBar.contains(event.target) &&
        document.querySelector(".autocomplete-dropdown-new")
      ) {
        if (
          event.target.tagName !== "INPUT" &&
          event.target.type !== "checkbox" &&
          event.target.id !== "custom_button_close"
        ) {
          //  document.querySelector(".autocomplete-dropdown-new").style.display = "none";
          setPlaceholderText("Destination / Villa");
        }
        setPlaceholderText("Destination / Villa");
      }
      if (
        !people.contains(event.target) &&
        document.querySelector(".popover-dropdown")
      ) {
        document.querySelector(".popover-dropdown").style.display = "none";
      }
      // if (!flight.contains(event.target)) {
      //   document.querySelector(".flight-dropdown")?.style?.display = "none";
      // }
    });

    let paramsQuery = utils.queryStringParse(
      decodeURIComponent(window.location.search)
    );
    if (Object.keys(paramsQuery).length) {
      let obj = determineAutoPlaceholder(paramsQuery);
      if (!!obj) {
        paramsQuery[obj.label] = obj.data;
      }
      props.fetchPlaceholder(paramsQuery);
      if (
        paramsQuery.hasOwnProperty("start_date") ||
        paramsQuery.hasOwnProperty("yearMonth")
      ) {
        props.noDates(false);
        props.resetDates(false);
      }
    }
    preserveQuery(paramsQuery);

    async function fetchAffiliateGlobalData() {
      csrfAPI
        .get(`/api/v2/affiliate-global-data/${window.drupalSettings.referral}`)
        .then((response) => {
          if (response) {
            
            setAffiliateGlobal(response.data);
          }
        })
        .catch((e) => console.log(e));
    }

    fetchAffiliateGlobalData();
  }, []);

  let SEARCH_PATH = "villas/search";
  const navigateToSearchListing = () => {
    let data = {};

    if (props.data.location.current) {
      props.data.location = props.data.location.current;
      delete props.data.location.current;
      data = props.data;
    } else {
      data = props.data;
    }

    let queryParams = {};
    if (isButtonClickable) {
      Object.keys(data).forEach((val) => {
        if (Object.keys(data[val]).length) {
          if (Object.keys(data[val]).includes("villa_name")) {
            Object.keys(data[val]).forEach((next) => {
              queryParams[next] = data[val][next];
            });
          } else {
            Object.keys(data[val]).forEach((next) => {
              queryParams[next] = data[val][next].toString().replace("&", "$");
            });
          }
        }
      });

      changeTitle("");
      changeDisabled("");
      queryParams["referral"] = window.drupalSettings.referral;
      if (props.duration.duration.length > 0) {
        queryParams["duration"] = props.duration.duration;
      } else {
        queryParams["duration"] = 7;
      }

      let base_url = window.drupalSettings.base_url;
      //let base_url = "http://localhost:5001";
      if (
        Object.keys(queryParams).length > 0 &&
        queryParams.hasOwnProperty("villa_name")
      ) {
        let url = queryParams.villa_name.url;

        queryParams["villa_id"] = queryParams.villa_name.villa_id;
        queryParams["villa_name"] = queryParams.villa_name.label;
        window.location.href = `${base_url}${url}?${utils?.getQueryStringFromObject(
          queryParams
        )}`;
      } else if (Object.keys(queryParams).length > 0) {
        window.location.href = `${base_url}/${SEARCH_PATH}?${utils?.getQueryStringFromObject(
          queryParams
        )}`;
      } else {
        window.location.href = `${base_url}/${SEARCH_PATH}?`;
      }
    }
  };

  let placeholder = props.placeholder;
  let autoCompletePlaceholder = placeholder
    ? placeholder.destination ||
      placeholder.resorts ||
      placeholder.region ||
      placeholder.region_group ||
      placeholder.query
    : placeholderText;

  return (
    <>
      <div className="widget_html block-custom-search">
        <div className="grid-x hero-inner-title">
          <div className="cell small-12 medium-auto">
            <h1
              className="white-out"
              dangerouslySetInnerHTML={{
                __html: affiliateGlobal.data!=undefined ? affiliateGlobal.data.heading_text:'',
              }}
            ></h1>
          </div>
          <div className="cell small-12 medium-shrink solLogo">
            <a
              href={window.drupalSettings.base_url}
              target="_blank"
              rel="noopener"
              className="hero-review-image"
            >
              <img src={partnar_logo} alt="Solmar" />
            </a>
          </div>
        </div>

        <div className="site-search">
          <div className="grid-x">
            <div
              className="cell small-12 medium-auto autocomplete"
              ref={autocompleteRef}
            >
              {/* <div className="autocomplete"> */}
              <AutoCompleteInput
                responsevilla={villas}
                responsedestination={destination}
                asyncOnChange={getresult}
                searchConstraint={2}
                placeholder={autoCompletePlaceholder}
                handlefocus={handleAutoOnfocus}
                autocompleteLabel={placeholderText}
                popover={popover.autocomplete}
                // autocompleteRef={autocompleteRef}
                setIsButtonClickable={setIsButtonClickable}
                onAutoCompleteKeyup={(e) => {
                  if (typeof e === "object" && typeof e.target != "undefined") {
                    changeTitle(e.target.value);
                  } else {
                    changeTitle(e);
                    changeDisabled(e);
                  }
                }}
              />
            </div>
            <div className="cell small-12 medium-auto duration-dropdown">
              <DurationInput />
            </div>
            <div
              className="cell small-12 medium-auto datepicker"
              ref={datepickerRef}
            >
              {/* <div className="datepicker"> */}
              <DatePickerContainer
                handlefocus={handleDatepickerOnfocus}
                popover={popover.datepicker}
                // datepickerRef={datepickerRef}
              />
            </div>
            <div
              className="cell small-12 medium-auto peoplecounter"
              ref={peopleRef}
            >
              <PeopleCounter
                handlefocus={handlePeopleOnfocus}
                popover={popover.people}
                // peopleRef={peopleRef}
              />
            </div>
            {/* <div className="cell small-12 medium-shrink flight" ref={flightRef}>
          <FlightSearch
            handlefocus={handleflightOnfocus}
            popover={popover.flight}
            // flightRef={flightRef}
          />
        </div> */}
            <div
              className="cell small-12 medium-shrink input top-search-btn"
              ref={searchRef}
            >
              <button
                className="button secondary white-out upper search-button"
                onClick={() => navigateToSearchListing()}
                //title={message}
                disabled={disabled}
                id="SearchBarDisabled"
              >
                Search
              </button>
              <span id="mobileMessageSearch"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    data: state.searchQuery,
    placeholder: state.placeholder,
    duration: state.selectedDuration,
  };
};
export default connect(mapStateToProps, {
  selectLocation,
  fetchPlaceholder,
  selectPassenger,
  getDate,
  noDates,
  resetDates,
  getDuration,
})(SearchBar);

function getResponse(data, value) {
  let labelKeys = [
    "vl_title",
    "rn_group_info",
    "des_info",
    "rt_info",
    "rn_info",
  ];
  let elasticObject = {};
  let str = value;
  let patt = new RegExp(str, "i");
  // let singlePatt = new RegExp("single", "i");
  let reg = /\b(?:single|airport|group)\b/gi;
  for (let i = 0; i < data.length; i++) {
    let { _source } = data[i];
    let uri = _source.url[0];
    let id = _source.pid[0];
    labelKeys.forEach((key) => {
      var valuePush = elasticObject[key] ? elasticObject[key] : [];
      var values = _source[key] ? _source[key][0] : "";
      switch (key) {
        case "vl_title":
          if (patt.test(values)) {
            values = {
              label: values,
              url: uri,
              villa_id: id,
              resort: _source.hasOwnProperty("rt_info")
                ? _source.rt_info[0].name
                : "",
            };
            valuePush.push(values);
          }
          break;
        case "rt_info":
          let misSpellResort = _source["rt_miskey"]
            ? _source.rt_miskey.some((rx) => patt.test(rx))
            : false;
          // let parentSingle = _source["rn_info"]
          //   ? singlePatt.test(_source.rn_info[0].name)
          //   : false;
          // if ((patt.test(values.name) || misSpellResort) && !parentSingle) {
          if (patt.test(values.name) || misSpellResort) {
            values = {
              label: values.name,
              // area: _source.hasOwnProperty('rn_info') ? _source.rn_info[0].name: _source.des_info[0].name,
              area: fetchLocation(_source),
              identifier: "resort",
              location_id: values.location_id,
              nid: values.nid,
            };
            valuePush.push(values);
          }
          break;
        case "rn_info":
          let misSpellRegion = _source["rn_miskey"]
            ? _source.rn_miskey.some((rx) => patt.test(rx))
            : false;
          let singleRegion =
            _source["rn_info"] && !!_source.rn_info[0].name.match(reg)
              ? true
              : false;
          let parentSingleRegion =
            _source["des_info"] && !!_source.des_info[0].name.match(reg)
              ? true
              : false;
          if (
            (patt.test(values.name) || misSpellRegion) &&
            !singleRegion &&
            !parentSingleRegion
          ) {
            values = {
              label: values.name,
              area: _source.des_info[0].name,
              identifier: "region",
              location_id: values.location_id,
              nid: values.nid,
            };
            valuePush.push(values);
          }
          break;
        case "rn_group_info":
          let singleRegion_group =
            _source["rn_group_info"] &&
            !!_source.rn_group_info[0].name.match(reg)
              ? true
              : false;
          if (patt.test(values.name) && !singleRegion_group) {
            values = {
              label: values.name,
              area: _source.des_info[0].name,
              identifier: "region_group",
              location_id: values.location_id,
              nid: values.nid,
            };
            valuePush.push(values);
          }
          break;
        case "des_info":
          if (patt.test(values.name)) {
            values = {
              label: values.name,
              area: _source.des_info[0].name,
              identifier: "destination",
              location_id: values.location_id,
              nid: values.nid,
            };
            valuePush.push(values);
          }
          break;
      }
      elasticObject[key] = valuePush;
    });
  }
  Object.keys(elasticObject).forEach((key) => {
    if (key === "vl_title") {
      elasticObject[key] = elasticObject[key].sort((a, b) =>
        a.label > b.label ? 1 : b.label > a.label ? -1 : 0
      );
    } else {
      // elasticObject[key] = removeDuplicates(elasticObject[key], "location_id");
      elasticObject[key] = removeDuplicates(elasticObject[key], "nid");
    }
  });
  return elasticObject;
}
function removeDuplicates(myArr, prop) {
  myArr.sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

function determineAutoPlaceholder(paramsQuery) {
  if (paramsQuery.hasOwnProperty("destination")) {
    return {
      label: "destination",
      data: paramsQuery.destination.replace(/%20/gim, " "),
    };
  } else if (paramsQuery.hasOwnProperty("resorts")) {
    return {
      label: "resorts",
      data: paramsQuery.resorts.replace(/%20/gim, " "),
    };
  } else if (paramsQuery.hasOwnProperty("region")) {
    return { label: "region", data: paramsQuery.region.replace(/%20/gim, " ") };
  } else if (paramsQuery.hasOwnProperty("region_group")) {
    return {
      label: "region_group",
      data: paramsQuery.region_group.replace(/%20/gim, " "),
    };
  }
}

function fetchLocation(_source) {
  let reg = /\b(?:single|region|airport|group)\b/gi;
  let validate =
    _source.hasOwnProperty("rn_info") && !!_source.rn_info[0].name.match(reg)
      ? false
      : true;
  if (validate) {
    return _source.rn_info[0].name;
  } else {
    return _source.des_info[0].name;
  }
}
