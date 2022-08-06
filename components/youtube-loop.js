import React from 'react'
import cx from 'classnames'

const YoutubeLoop = ({
  title,
  id,
  width = 16,
  height = 9,
  initialState = false,
  className,
  ...rest
}) => {
  if (!id) return null

  return (
    <div className={cx('video-loop', className)} {...rest}>
      <iframe
        title={title}
        src={`https://www.youtube.com/embed/${id}?controls=0&showinfo=0&rel=0&autoplay=1&mute=1&loop=1&playlist=${id}`}
        frameBorder="0"
        allow="autoplay; allowFullScreen"
        style={{
          height: "100%",
          minHeight: "100%",
          minWidth: "100%",
        }}
      ></iframe>
    </div>
  )
}

export default YoutubeLoop
