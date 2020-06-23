import { flowRight, includes, omit } from 'lodash';
import { extension } from 'mime-types';
import React, { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { MDCMenu } from '@material/menu';

import Inputs, { CustomInputProps } from '../';
import { EDKAlert } from '../../alert';
import { FlexRowCenter } from '../../flex';
import { useIsMounted } from '../../hooks/use-is-mounted';
import { Loading } from '../../loading';
import { CenteredModal } from '../../modal/centered-modal';

const FileInput = styled.input`
  position: absolute;
  left: -10000px;
`

const ChooseFile = styled.div<any>`
  color: ${(props) =>
    props.loading === 'yes'
      ? 'rgba(0,0,0,0)'
      : props.disabled
      ? 'rgba(0, 0, 0, 0.37)'
      : 'rgba(0, 0, 0, 0.87)'} !important;
  font-size: 10px !important;
  font-weight: 500;
  height: 46px;
  background: #f5f5f5;
  top: 1px !important;
  right: 1px !important;
  padding-right: 12px;
  line-height: 46px !important;
  border-top-right-radius: 23px;
  border-bottom-right-radius: 23px;
  transform: scale(1) !important;
  padding-left: 12px;
  cursor: pointer !important;
  outline: none !important;
`

const LoadingContainer = styled(FlexRowCenter)<any>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${(props) => (props.loading === 'yes' ? '1' : '0')};
`

const ImageEl = styled.img`
  max-height: 400px;
  max-width: 400px;
`

interface IFileFieldProps extends CustomInputProps {
  t(key: string): any
  disableChange?: boolean
}

function _FileField(props: IFileFieldProps) {
  const isMounted = useIsMounted()
  const menuRef = useRef<any>()
  const inputRef = useRef<any>()
  const imageOptionsRef = useRef<any>()
  const holderOriginalId = useRef()

  const [loading, setLoading] = useState(false)
  const [masking, setMasking] = useState<any>()
  const [image, setImage] = useState()
  const [isModalOpen, setModalOpen] = useState(false)
  const [pdf, setPdf] = useState<any>()

  const inputProps: any = omit(props, ['rangeValue', 'onUpload'])

  const onClick = useCallback(
    (force?: boolean) => {
      if (inputRef.current && !props.disabled && !loading) {
        if (force || !image) !props.disableChange && inputRef.current.click()
        else if (menuRef.current) menuRef.current.open = true
      }
    },
    [props, loading, image]
  )

  const validateExtensions = useCallback((sFileName: string) => {
    const _validFileExtensions = [
      '.jpg',
      '.jpeg',
      '.bmp',
      '.gif',
      '.png',
      'pdf'
    ]
    if (sFileName.length > 0) {
      var blnValid = false
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j]
        if (
          sFileName
            .substr(
              sFileName.length - sCurExtension.length,
              sCurExtension.length
            )
            .toLowerCase() == sCurExtension.toLowerCase()
        ) {
          blnValid = true
          break
        }
      }
      return blnValid
    }
    return false
  }, [])

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.persist()
      const file = event.target.files && event.target.files[0]
      if (file) {
        const isValidFileType = validateExtensions(file.name)
        const sizeInMb = file.size / 1024 / 1024
        if (!isValidFileType || sizeInMb > 10) {
          // not valid
          props.onChange(
            props.fileType,
            undefined,
            props.t('UPLOAD_2_DISCLAIMER')
          )
          EDKAlert.show({
            title: props.t('OPS_WRONG_FORMAT'),
            subtitle: props.t('ERROR_FORMAT'),
            type: 'warning'
          })
        } else {
          // good to go,
          if (props.onUpload && isMounted.current) {
            setLoading(true)
            props.onUpload(
              props.fieldId,
              props.fileType,
              file,
              (fileName?: any, originalId?: any, base64file?: any) => {
                setLoading(false)
                if (fileName) setMasking(fileName)
                holderOriginalId.current = originalId
                setImage(base64file)
              }
            )
          }
        }
      }
    },
    [props]
  )

  const previewClicked = useCallback(() => {
    switch (pdf) {
      case undefined:
        setModalOpen(true)
        break
      default:
        typeof window !== undefined &&
          (() => {
            const extensionWithDot = `.${extension(pdf.type)}`
            const fName = includes(masking, extensionWithDot)
              ? masking
              : `${masking}${extensionWithDot}`

            const url = window.URL.createObjectURL(new Blob([pdf]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fName)
            document.body.appendChild(link)
            link.click()
            setTimeout(() => {
              document.body.removeChild(link)
            }, 400)
          })()
        break
    }
  }, [pdf, masking])

  useEffect(() => {
    if (props.value && props.value.original && isMounted.current) {
      if (
        props.value.original !== holderOriginalId.current &&
        props.onGetImage
      ) {
        // need to get image;
        holderOriginalId.current = props.value.original
        setLoading(true)
        props.onGetImage(
          props.value.original,
          (image: any, imageName: string, imageType = 'image') => {
            switch (imageType) {
              case 'image':
                image &&
                  (() => {
                    setImage(image)
                    setMasking(imageName)
                    setPdf(undefined)
                  })()
                break
              default:
                setPdf(image)
                setImage(image)
                setMasking(imageName)
            }

            setLoading(false)
          }
        )
      }
    }
  }, [props.value])

  useEffect(() => {
    if (!menuRef.current && imageOptionsRef.current) {
      menuRef.current = new MDCMenu(imageOptionsRef.current)
    }
  }, [])

  return (
    <React.Fragment>
      <Inputs
        {...inputProps}
        value={masking}
        onClick={() => {
          onClick()
        }}
        readOnly={true}
        className={'file-input'}
        trailingIcon={
          <ChooseFile
            loading={loading ? 'yes' : 'no'}
            disabled={props.disabled}
            className={'choose'}
          >
            Choose file
            <LoadingContainer loading={loading ? 'yes' : 'no'}>
              <Loading color={'#4A87F2'} />
            </LoadingContainer>
          </ChooseFile>
        }
        isAnchor={true}
        anchorOptions={
          <div className={`mdc-menu mdc-menu-surface`} ref={imageOptionsRef}>
            <ul className='mdc-list'>
              <li
                onClick={() => {
                  previewClicked()
                }}
                className='mdc-list-item'
                role='menuitem'
              >
                <span className='mdc-list-item__text'>Preview</span>
              </li>
              {props.disableChange ? null : (
                <li
                  onClick={() => {
                    onClick(true)
                  }}
                  className='mdc-list-item'
                  role='menuitem'
                >
                  <span className='mdc-list-item__text'>Change File</span>
                </li>
              )}
            </ul>
          </div>
        }
      />
      <FileInput type={'file'} ref={inputRef} onChange={onChange} />
      <CenteredModal
        onCloseRequested={() => {
          setModalOpen(false)
        }}
        isShow={isModalOpen}
      >
        <ImageEl src={image} />
      </CenteredModal>
    </React.Fragment>
  )
}

export const EDKFileField = flowRight([memo])(_FileField)
