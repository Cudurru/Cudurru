/*
$(document).ready(function() {
  $('.property-search').on('keyup', function() {
    let empty = false;

    $('.property-search').each(function() {
      empty = $(this).val().length == 0;
    });

    if (empty)
      $('.actions input').attr('disabled', 'disabled');
    else
      $('.actions input').attr('disabled', false);
  });
});

function initAutocomplete() {
  const googleComponents = [
    { googleComponent: 'sublocality_level_1', id: 'city-address-field' },
    { googleComponent: 'locality', id: 'city-address-field' },
    { googleComponent: 'administrative_area_level_1', id: 'state-address-field' },
    { googleComponent: 'postal_code', id: 'postal-code-address-field' },
  ];
  const autocompleteFormField = document.getElementsByClassName('property-search');
  const autocomplete = new google.maps.places.Autocomplete((autocompleteFormField), {
    types: ['address'],
    componentRestrictions: ['us'],
  });
  google.maps.event.clearInstanceListeners(autocompleteFormField);
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
    const place = autocomplete.getPlace();
    autocompleteFormField.value = place.name;
    for (const component in googleComponents) {
      const addressComponents = place.address_components;
      addressComponents.forEach( addressComponent => populateFormElements(addressComponent, googleComponents[component]));
    }
  });
}

function populateFormElements(addressComponent, formMap) {
  const addressType = addressComponent.types[0];
  if (formMap.googleComponent === addressType) {
    const formValue = addressComponent.long_name;
    document.getElementById(formMap.id).value = formValue;
  }
}
*/