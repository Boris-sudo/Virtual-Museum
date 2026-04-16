import { Pipe, PipeTransform } from '@angular/core';
import { BlogModel } from '../models/blog';

@Pipe({
    name: 'blogsFilter'
})
export class BlogsFilterPipe implements PipeTransform {

    transform(value: BlogModel[], ...filter: any[]): BlogModel[] {
        return value.filter((blog: BlogModel) => {
            if (filter[0] !== "all" && Number(blog.date.split('.')[2]) !== Number(filter[0])) return false;
            if (blog.title.toLowerCase().indexOf(filter[1].toLowerCase()) === -1) return false;
            if (blog.difficulty < Number(filter[2])) return false;
            if (blog.difficulty > Number(filter[3])) return false;
            return true;
        });
    }

}
