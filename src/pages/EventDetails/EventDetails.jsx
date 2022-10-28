import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import TwitterLikeButton from 'twitter-like-button';
import './EventDetails.css';
import {
  Container,
  Header,
  Image,
  Button,
  Icon,
  Label,
  Divider,
} from 'semantic-ui-react';
import * as eventAPI from '../../utils/eventAPI';
import * as likesAPI from '../../utils/likesAPI';
import Map from '../../components/Map/Map';

export default function EventDetails({ user, prettifyDate, getAllEvents }) {
  const [oneEvent, setOneEvent] = useState({});
  const [clicked, setClicked] = useState(false);
  const { id } = useParams();
  const nav = useNavigate();

  // ========== Calls ========== //
  const getOneEvent = useCallback(async () => {
    try {
      const res = await eventAPI.getOne(id);
      setOneEvent(res.data);
    } catch (err) {
      console.log(err, '<<< err from getOneEvent()');
    }
  }, [id]);

  useEffect(() => {
    console.log('useEfx: EventDetails()');
    getOneEvent();
  }, [getOneEvent]);

  const startDate = prettifyDate(oneEvent.start);
  const endDate = prettifyDate(oneEvent.end);

  // ========== Event Funcs ========== //
  async function handleEventDelete(eventID) {
    try {
      const res = await eventAPI.deleteEvent(eventID);
      console.log(res, '<--- res from handleEventDelete(): EventDetails');
      nav('/events');
    } catch (err) {
      console.log(err, '<--- err from handleEventDelete(): EventDetails');
    }
    getAllEvents();
  }

  // ========== Like Funcs ========== //
  async function addLike(eventID) {
    // Where is the postId defined in the UI?

    try {
      const response = await likesAPI.create(eventID);
      console.log(response, '<--- addlike() reaponse');
      setClicked(true);
      getOneEvent();
    } catch (err) {
      console.log(err, '<--- err from addLike(): EventDetails');
    }
  }

  async function removeLike(likeId) {
    try {
      const response = await likesAPI.removeLike(likeId);
      console.log(response, '<--- removelike() response');
      setClicked(false);
      getOneEvent();
    } catch (err) {
      console.log(err, '<--- err from removeLike(): EventDetails');
    }
  }

  const likedIndex = oneEvent?.likes?.findIndex(
    (like) => like.username === user.username
  );
  const isLiked = likedIndex > -1 ? true : false;
  const clickHandler =
    likedIndex > -1
      ? () => removeLike(oneEvent.likes[likedIndex]._id)
      : () => addLike(oneEvent._id);

  return (
    <Container className="container-event-details">
      <div id="event-hero">
        <Image src={oneEvent.poster} alt="poster" id="gaussian-poster" />
      </div>
      <div className="event-details-container">
        <div className="event-details-poster">
          <Image id="poster" src={oneEvent.poster} alt="poster" />
        </div>
        <div className="event-details-info-head">
          <Header as="h1">{oneEvent.title}</Header>
          <Divider className="event-details-divider"></Divider>
          <Header as="h4">
            <Icon name="calendar outline" />
            <Header.Content>Start Time</Header.Content>
          </Header>
          <p>{startDate}</p>
          <Header as="h4">
            <Icon name="calendar" />
            <Header.Content>End Time</Header.Content>
          </Header>
          <p>{endDate}</p>
          <Header as="h4">
            <Icon name="user" />
            <Header.Content>Hosted by:</Header.Content>
          </Header>
          <p>
            <Image
              className="host-img"
              avatar
              src={oneEvent?.user?.photoUrl}
            ></Image>
            <Link
              to={`/${oneEvent?.user?.username}`}
              style={{ color: 'black' }}
            >
              {oneEvent?.user?.username}
            </Link>
          </p>
          <div className="event-btns">
            <div className="btn-like">
              <TwitterLikeButton
                isLiked={isLiked}
                onClick={clickHandler}
              ></TwitterLikeButton>
              <Label circular color="red" className="count-like">
                {oneEvent?.likes?.length}
              </Label>
            </div>
            <div className="btn-edit">
              <Link to={`/events/${id}/edit`}>
                <Icon name="edit" size="large"></Icon>
              </Link>
            </div>
          </div>
        </div>
        <div className="event-details-info-body">
          <Header as="h4">
            <Icon name="map marker alternate" />
            <Header.Content>Location</Header.Content>
          </Header>
          <p>{oneEvent?.location}</p>
          {/* <Map event={oneEvent}></Map> */}
          <Header as="h4">About this event</Header>
          {oneEvent.description}
          {oneEvent?.user?.username === user.username ? (
            <Button
              style={{ width: '15rem', marginTop: '20px' }}
              animated="vertical"
              onClick={() => handleEventDelete(oneEvent._id)}
            >
              <Button.Content visible>
                <Icon name="delete"></Icon>
              </Button.Content>
              <Button.Content hidden>Delete Event</Button.Content>
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
    </Container>
  );
}
