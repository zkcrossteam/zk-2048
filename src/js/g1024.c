#include <stdint.h>
#include <zkwasmsdk.h>


int board[16] = {
    1,0,1,0,
    1,1,0,0,
    1,0,0,1,
    1,1,0,0,
};

int currency = 20;

__attribute__((visibility("default")))
void setBoard(int index, int b) {
  board[index] = b;
}

__attribute__((visibility("default")))
int getBoard(int index) {
  return board[index];
}

__attribute__((visibility("default")))
void setCurrency(int n) {
  currency = n;
}

__attribute__((visibility("default")))
int getCurrency(int n) {
  return currency;
}

void random_fill() {
  int total = 0;
  int sum = 0;
  int min = 16;
  for (int i=0; i<16; i++) {
    sum += board[i];
    if (board[i] ==0) {
      total +=1;
    } else  if (min > board[i]) {
      min = board[i];
    }
  };
  if (total==0) {
    return;
  }
  int c = sum%total;
  //int r = sum%total;
  for (int i=0; i<16; i++) {
    if (board[i] == 0) {
      if (c==0) {
          board[i] = 1;
          return;
      } else {
        c--;
      }
    }
  }
}

void reward(int k) {
  if (k>4) {
    currency = currency + (1 << (k - 4));
  }
}

void left(void) {
#pragma clang loop unroll(full)
  for (int r=0; r<4; r++) {
    int cur = r*4;

    /* remove all zeros */
    for (int i=0; i<4; i++) {
      int current = r*4+i;
      if (board[current]!=0) {
        board[cur] = board[current];
        cur = cur+1;
      }
    }
    for (; cur<r*4+4; cur++) {
        board[cur] = 0;
    }


    /* patch pairs */
    cur = r*4;
    for (int s=0; s<4; ) {
      int current = r*4 + s;
      int next = current + 1;
      if (s!=3 && board[current] == board[next]) {
        int r = board[current];
        reward(r);
        board[cur] = r+1;
	++cur;
        s = s + 2;
      } else {
        board[cur] = board[current];
	++cur;
        s = s + 1;
      }
    }
    // Fill zero for the rest
    for (; cur<r*4+4; cur++) {
        board[cur] = 0;
    }
  }
}

void right(void) {
#pragma clang loop unroll(full)
  for (int r=0; r<4; r++) {
    int cur = r*4+3;

    /* remove all zeros */
    for (int i=0; i<4; i++) {
      int current = r*4+3-i;
      if (board[current]!=0) {
        board[cur] = board[current];
        cur = cur-1;
      }
    }
    for (; cur>=r*4; cur--) {
        board[cur] = 0;
    }

    /* patch pairs */
    cur = r*4 + 3;
    for (int s=3; s>=0; ) {
      int current = r*4+s;
      int next = current-1;
      if (s!=0 && board[current] == board[next]) {
        int r = board[current];
        reward(r);
        board[cur] = r+1;
        cur = cur - 1;
        s = s - 2;
      } else {
        board[cur] = board[current];
        cur = cur - 1;
        s = s - 1;
      }
    }
    // Fill zero for the rest
    for (; cur>=r*4; cur--) {
        board[cur] = 0;
    }
  }
}

void top(void) {
#pragma clang loop unroll(full)
  for (int c=0; c<4; c++) {

    int cur = c;

    /* remove all zeros */
    for (int i=0; i<4; i++) {
      int current = i*4 + c;
      if (board[current]!=0) {
        board[cur] = board[current];
        cur = cur+4;
      }
    }
    while (cur < 16) {
        board[cur] = 0;
        cur = cur + 4;
    }

    cur = c;
    for (int s=0; s<4; ) {
      int current = s*4 + c;
      int next = current + 4;
      if (s!=3 && board[current] == board[next]) {
        int r = board[current];
        reward(r);
        board[cur] = r+1;
        cur = cur + 4;
        s = s + 2;
      } else {
        board[cur] = board[current];
        cur = cur + 4;
        s = s + 1;
      }
    }
    // Fill zero for the rest
    while (cur<16) {
        board[cur] = 0;
        cur = cur + 4;
    }
  }
}

void bottom(void) {
#pragma clang loop unroll(full)
  for (int c=0; c<4; c++) {
    int cur = 12 + c;

    /* remove all zeros */
    for (int i=3; i>=0; i--) {
      int current = i*4 + c;
      if (board[current]!=0) {
        board[cur] = board[current];
        cur = cur-4;
      }
    }
    while (cur>=0) {
        board[cur] = 0;
        cur = cur - 4;
    }


    /* patch pairs  */
    cur = 12 + c;
    for (int s=3; s>=0;) {
      int current = s*4 + c;
      int next = current - 4;
      if (s!=0 && board[current] == board[next]) {
        int r = board[current];
        reward(r);
        board[cur] = r+1;
        cur = cur - 4;
        s = s - 2;
      } else {
        board[cur] = board[current];
        cur = cur - 4;
        s = s - 1;
      }
    }
    while (cur >= 0) {
        board[cur] = 0;
        cur = cur - 4;
    }
  }
}

__attribute__((visibility("default")))
void sell(int n) {
  require(n>=0);
  require(n<16);
  for (int i=0;i<16;i++) {
    require(board[i]<=board[n]);
  }
  require(board[n] > 0);
  currency += 1 << (board[n] - 1);
  board[n] = 0;
}

__attribute__((visibility("default")))
void step(int direction) {
  require(currency > 0);
  currency--;
  if(direction == 0) {
    top();
  } else if(direction == 1) {
    left();
  } else if(direction == 2) {
    bottom();
  } else if(direction == 3) {
    right();
  }
  random_fill();
}

enum Command {
  TOP = 0,
  LEFT,
  BOTTOM,
  RIGHT,
  SELL,
};

uint8_t cmd_buf[1024];

__attribute__((visibility("default")))
int zkmain() {
   int len = (int)wasm_input(1);
   int cursor = 0;
   read_bytes_from_u64(cmd_buf, len, 0);
   while (cursor < len) {
     if (cmd_buf[cursor] <= 3) {
       step(cmd_buf[cursor]);
       cursor++;
     } else {
       // This needs to be sell
       cursor++;
       int cell_index = cmd_buf[cursor];
       sell(cell_index);
       cursor++;
     }
   }
   return 0;
}
