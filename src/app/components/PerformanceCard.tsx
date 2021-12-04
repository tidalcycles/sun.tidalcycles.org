import React, { ReactElement, useState } from "react";
import "../../assets/css/PerformanceCard.css";
import { EmptyMuxyStream, MuxyStream } from "../types";
import PerformanceCreateForm from "./PerformanceCreateForm";
import PerformanceDestroyForm from "./PerformanceDestroyForm";
import { DateTime } from "luxon";

interface Props {
  muxyStream: MuxyStream | EmptyMuxyStream;
  cycleNo: number;
  eventUrl: string;
}

const PerformanceCard = ({
  muxyStream,
  cycleNo,
  eventUrl,
}: Props): ReactElement => {
  const [inCreateMode, setInCreateMode] = useState<boolean>(false);
  const [inRemoveMode, setInRemoveMode] = useState<boolean>(false);
  const [removed, setRemoved] = useState<boolean>(false);

  const startsAtHs = DateTime.fromISO(muxyStream.starts_at).toFormat("HH:mm");
  const endsAtHs = DateTime.fromISO(muxyStream.ends_at).toFormat("HH:mm");

  let text = null;
  if ("publisher_name" in muxyStream) {
    const { publisher_name, location, description, timezone } = muxyStream;
    text = [publisher_name, location, description, timezone].join(" / ");
  }

  const handleRemoveClick = () => setInRemoveMode((prevState) => !prevState);
  const handleRemove = () => setRemoved(true);

  return (
    <div className="card">
      <div className="card-body">
        <p className="card-header">Cycle #{cycleNo}</p>
        <p className="card-time">
          {startsAtHs}-{endsAtHs}{" "}
          {!inCreateMode && !text && (
            <button
              className="card-button-plus"
              onClick={() => setInCreateMode(true)}
            >
              +
            </button>
          )}
        </p>
        {removed && <p>You have removed your slot succesfully.</p>}
        {inCreateMode ? (
          <PerformanceCreateForm
            eventUrl={eventUrl}
            startsAt={muxyStream.starts_at}
            endsAt={muxyStream.ends_at}
          />
        ) : (
          <>
            <p className="card-text">{removed ? "[REMOVED]" : text || ""}</p>
            {!removed && text && (
              <>
                <button onClick={handleRemoveClick} className="card-button">
                  Remove
                </button>
                {inRemoveMode && "url" in muxyStream && (
                  <PerformanceDestroyForm
                    streamUrl={muxyStream.url}
                    onRemove={handleRemove}
                  />
                )}
              </>
            )}
          </>
        )}

        <hr />
      </div>
    </div>
  );
};

export default PerformanceCard;
