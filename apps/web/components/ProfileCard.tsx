import Image from "next/image";
import Clock from "./Clock";

export const ProfileCard = ({
  src,
  username,
  time,
}: {
  src?: string;
  username?: string;
  time?: number;
}) => {
  if (!username) {
    return null;
  }

  return (
    <div className=" flex justify-between">
      <div className=" flex space-x-3 py-4">
        <div>
          <Image
            src={
              src ??
              "https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif"
            }
            width={50}
            height={50}
            alt="opponent"
            className=" cursor-pointer"
          />
        </div>
        <div>
          <div className=" text-white ">{username}</div>
        </div>
      </div>
      <div className=" flex items-center">
        {time}
        <Clock time={10} />
      </div>
    </div>
  );
};
