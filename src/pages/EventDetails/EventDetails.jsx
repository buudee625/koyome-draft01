import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Header,
  Image,
  Button,
  Icon,
} from 'semantic-ui-react';
import * as eventAPI from '../../utils/eventAPI';

export default function EventDetails({ user, getAllEvents }) {
  const [oneEvent, setOneEvent] = useState({});
  const { id } = useParams();
  const nav = useNavigate();

  async function getOneEvent() {
    try {
      const res = await eventAPI.getOne(id);
      setOneEvent(res.data);
    } catch (err) {
      console.log(err, '<<< err from getOneEvent()');
    }
  }

  useEffect(() => {
    console.log('useEfx from EventDetails()');
    getOneEvent();
  }, []);

  async function handleEventDelete(eventID) {
    try {
      const res = await eventAPI.deleteEvent(eventID);
      console.log(res, '<< res from handleEventDelete(): EventCard ');
    } catch (err) {
      console.log(err);
    }
    nav('/events');
    getAllEvents();
  }

  return (
    <Container textAlign="center" style={{ marginTop: '5em' }}>
      <Grid style={{ width: '100vw' }}>
        <Grid.Row>
          <Grid.Column width={7}>
            <Header as="h3" inverted>
              {oneEvent.title}
            </Header>
            <Header as="h3" inverted>
              {oneEvent.start}
            </Header>
            <Header as="h3" inverted>
              {oneEvent.end}
            </Header>
            <Header as="h3" inverted>
              {oneEvent.description}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Column width={7}>
          <Image src={oneEvent.poster} alt="poster" />
        </Grid.Column>
        <Grid.Row>
          <Button
            style={{ width: '15rem' }}
            animated="vertical"
            onClick={() => handleEventDelete(oneEvent._id)}
          >
            <Button.Content visible>
              <Icon name="delete"></Icon>
            </Button.Content>
            <Button.Content hidden>Delete Event</Button.Content>
          </Button>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
