import "./room-group.styles.css";
import Room from "../room/room.component";
import { Container, Box } from "gestalt";

export const RoomGroup = (props) => (
  <Box color="midnight" padding={8}>
    <Container className="room-group" padding={0}>
      <Box color="transparent" padding={0} rounding={8}>
        {Object.keys(props.groups).map((key) => ([
          console.log( 'test'),
          <Room key={key} room={props.groups[key]} uniqueID={key} isHidden={props.groups[key].type.toLowerCase().includes("room") ? false : true} />,
          <Box key={key + 100} color="transparent" padding={5} rounding={8} display={props.groups[key].type.toLowerCase().includes("room") ? "" : "visuallyHidden"}></Box>
        ]))}
      </Box>
    </Container>
  </Box>
);
