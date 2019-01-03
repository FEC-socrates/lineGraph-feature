import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import InfoButton from '../client/components/InfoButton.jsx';

describe('infoButton Component', () => {

  var infoButton = shallow(<InfoButton />)

  it('should mount successfully', () => {
    expect(infoButton.find('.infoButtonContainer').length).toEqual(1);
  });

  it('should show value loaded in props', () => {
    infoButton.setProps({
      value: 123
    });
    expect(infoButton.find('.infoButtonValue').first().text()).toEqual('123');
  });

  it('should show tooltip only on mouseover and render text loaded in props', () => {
    infoButton.setProps({
      text: 'Honda Accord'
    });
    infoButton.find('.infoButtonContainer').simulate('mouseOver');
    expect(infoButton.find('.infoButtonTooltip').length).toEqual(1);
    expect(infoButton.find('.infoButtonTooltip').first().text()).toEqual('Honda Accord');
    infoButton.find('.infoButtonContainer').simulate('mouseLeave');
    expect(infoButton.find('.infoButtonTooltip').length).toEqual(0);
  });

});
