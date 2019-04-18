import React, { Component } from 'react';
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Progress, Container } from 'reactstrap';

class UserScoreGraphicCard extends Component {
  render() {
    console.log(this.props);
    const barUserScore = (this.props.userScore / this.props.teamScore) * 100;
    const barTeamScore = 100 - barUserScore;
    console.log(barUserScore, barTeamScore);
    return (
      <Container>
        <Card>
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            <Progress multi>
              <Progress bar animated value={barUserScore} color="warning" />
              <Progress bar animated value={barTeamScore} color="primary" />
            </Progress>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

export default UserScoreGraphicCard;
