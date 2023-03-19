import Link from 'next/link'
import styles from 'styles/club-info.module.css'
import Head from 'next/head'
import { useTheme } from '@nextui-org/react'
import { CSS, Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import ImageUploading from 'react-images-uploading'

export default function imageProcess(props) {
  const maxNumber = 10

  return (
    <div>
      <ImageUploading
        multiple
        value={props.images}
        onChange={props.onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={['jpg', 'png']}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <Button
              style={isDragging ? { color: 'red' } : { background: 'black' }}
              onPress={onImageUpload}
              bordered
              {...dragProps}
            >
              Click or Drop Here
            </Button>
            &nbsp;
            <Button onPress={onImageRemoveAll} bordered>
              Remove All Images
            </Button>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {imageList.map((image, index) => (
                <div key={index} style={{ marginRight: '50px' }}>
                  <img
                    style={{ marginTop: '10px', marginBottom: '10px' }}
                    src={image.data_url}
                    alt=""
                    width="100"
                    height="100"
                  />
                  <div>
                    <Button
                      bordered
                      style={{ marginBottom: '10px' }}
                      onPress={() => onImageUpdate(index)}
                    >
                      Update
                    </Button>
                    <Button
                      bordered
                      style={{ marginBottom: '10px' }}
                      onPress={() => onImageRemove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  )
}
