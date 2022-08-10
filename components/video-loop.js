import React from 'react'
import cx from 'classnames'
import { buildSrc } from '@lib/helpers'

const VideoLoop = ({
  title,
  url,
  poster,
  className,
  ...rest
}) => {
  if (!url) return null
  const posterImg = buildSrc(poster?.photo, {})

  return (
    <div className={className} {...rest}>
      <figure
        style={{
          height: "100%",
        }}
      >
        <video
          poster={posterImg}
          loop muted autoPlay playsInline
          style={{
            height: "100%",
            minWidth: "100%",
          }}
        >
          <source src={url} />
        </video>
      </figure>
    </div>
  )
}

export default VideoLoop
