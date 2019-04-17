export function GeoAddressShort(json) {
  if(json.status == 'OK') {
    let results = json.results;
    for (let address_component of results) {
      if (address_component.types[0] == "locality") {
        return address_component.address_components[1].short_name+" "+address_component.address_components[2].short_name;
      }
    };
  } else {
    return "";
  }
}

export function GeoAddressFull(json) {
  if(json.status == 'OK') {
    let results = json.results;
    for (let address_component of results) {
      if (address_component.types[0] == "route") {
        return address_component.formatted_address;
      }
    };
  } else {
    return "";
  }
}