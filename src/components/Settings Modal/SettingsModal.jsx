import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Typography } from '@material-tailwind/react'
import { Settings } from 'lucide-react'
import React from 'react'
import Loading from '../layout/Loading'

export default function SettingsModal({openSetting, settingHandler,userId,userType, isLoading}) {
  return (
    <Dialog open={openSetting} handler={settingHandler}>
        {isLoading? <Loading/>:<>
        <DialogHeader >
            <Typography variant='h5' className='flex items-center gap-1'> <Settings/>Settings</Typography>
        </DialogHeader>
        <DialogBody>
            <form className='flex flex-col gap-3'>
               <Input label="test"/>
               <Input label="test"/>
               <Input label="test"/>
            </form>
        </DialogBody>
        <DialogFooter className='flex flex-row gap-2'>
            <Button className='bg-primary'>Save</Button>
            <Button className='text-primary' variant='outlined' onClick={settingHandler}>Cancel</Button>
        </DialogFooter>
        </>}
    </Dialog>
  )
}
