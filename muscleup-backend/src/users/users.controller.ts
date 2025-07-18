import { Controller, Get, Patch, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMe(@Req() req: any){
        return this.usersService.findById(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async updateMe(@Req() req: any, @Body() updateUserDto: UpdateUserDto){
        return this.usersService.updateUser(req.user.id, updateUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('me')
    async deleteMe(@Req() req: any){
        return this.usersService.deleteUser(req.user.id);
    }
}
