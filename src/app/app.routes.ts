import { Routes } from '@angular/router';
import { UploadVideo } from './body/main/upload-video/upload-video';
import { VideoUrl } from './body/main/video-url/video-url';
import { Quiz } from './body/main/quiz/quiz';

export const routes: Routes = [

    {
        path: 'url',
        component: VideoUrl
    },
    {
        path: 'upload',
        component: UploadVideo
    },
    {
        path: 'quiz',
        component: Quiz
    }
];
