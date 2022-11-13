export class connectedUsers {
  private users = new Map();

  add(nickname: string, socketId: string) {
    this.users.set(nickname, socketId);
  }

  remove(nickname: string) {
    this.users.delete(nickname);
  }

  getSocketId(nickname: string) {
    return this.users.get(nickname);
  }

  get() {
    return this.users;
  }

  isActive(nickname: string): boolean {
    return this.users.has(nickname);
  }
}
