import React from 'react';
import { Card, CardImg, CardTitle, CardColumns, CardBody } from 'reactstrap';

import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

const incentiveItems = [
  { image: 'yogamat.png', alt: 'Yoga Mat' },
  { image: 'exerciseball.png', alt: 'Exercise Ball' },
  { image: 'yogastick.png', alt: 'Yoga Massage Stick' },
  { image: 'blenderbottle.png', alt: 'Blender Bottle' },
  { image: 'resistantbands.png', alt: 'Resistance Bands' },
  { image: 'microfibertowel.png', alt: 'Microfiber Towel' },
];

class Incentives extends React.Component {
  render() {
    const incentiveCols = incentiveItems.map((item, index) => {
      return (
        <Card>
          <CardImg top width="100%" src={`${process.env.PUBLIC_URL}/images/${item.image}`} alt={item.alt} />
          <CardBody>
            <CardTitle className="text-center">{item.alt}</CardTitle>
          </CardBody>
        </Card>
      );
    });

    return (
      <React.Fragment>
        <BreadcrumbFragment>{[{ active: true, text: 'Incentives' }]}</BreadcrumbFragment>

        <CardWrapper>
          To help motivate you during TransAction, check out a selection of some of the great prizes below that could be
          yours! These items were selected to help with your recovery or supplement your activity of choice. Door prizes
          will be drawn randomly each week, and prize packages will be awarded to the first, second and third place
          teams in both the Competitive and Recreational categories!
          <CardColumns className="mt-5">{incentiveCols}</CardColumns>
        </CardWrapper>
      </React.Fragment>
    );
  }
}

export default Incentives;
