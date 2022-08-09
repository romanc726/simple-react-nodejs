import React from 'react'
import cx from 'classnames'

const YoutubeLoop = ({
  title,
  id,
  className,
  srcType,
  ...rest
}) => {
  if (!id) return null

  return (
    <div className={cx('video-loop', className)} {...rest}>
      {
        srcType === "youtubeId" ? (
          <iframe
            title={title}
            src={`https://www.youtube.com/embed/${id}?controls=0&showinfo=0&rel=0&autoplay=1&mute=1&loop=1&playlist=${id}`}
            frameBorder="0"
            allow="autoplay; allowFullScreen"
            style={{
              height: "60vh",
              minWidth: "100%",
            }}
          ></iframe>
        )
          :
          (
            <iframe
              title={title}
              src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&autopause=0&loop=1&muted=1`}
              frameBorder="0"
              allow="autoplay; fullscreen"
              style={{
                height: "100%",
                minHeight: "60vh",
                minWidth: "100%",
              }}
            ></iframe>
          )
      }
    </div>
  )
}

export default YoutubeLoop
