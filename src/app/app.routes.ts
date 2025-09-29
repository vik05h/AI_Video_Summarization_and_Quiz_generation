import { Routes } from '@angular/router';
import { UploadVideo } from './body/main/upload-video/upload-video';
import { VideoUrl } from './body/main/video-url/video-url';
import { Quiz } from './body/main/quiz/quiz';
import { SignupComponent } from './body/signup/signup';
import { Home } from './body/home/home';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
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
    },
    {
        path: 'signup',
        component: SignupComponent
    }
];
