import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gpt-chat',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './gpt-chat.component.html',
  styleUrls: ['./gpt-chat.component.css'],
})
export class GptChatComponent {
  userInput: string = '';
  messages: { role: 'user' | 'assistant'; content: string }[] = [];
  isLoading = false;

  constructor(private http: HttpClient) {}
  sendQuickAdvice() {
    this.userInput = 'Tôi chưa tiêm, nên tiêm vắc xin nào?';
    this.sendMessage();
  }

  sendMessage() {
    const msg = this.userInput.trim();
    if (!msg || this.isLoading) return;

    this.messages.push({ role: 'user', content: msg });
    this.userInput = '';
    this.isLoading = true;

    // 🔁 Bước 1: Lấy danh sách vắc xin từ backend
    this.http.get<any>('https://localhost:7025/api/Vaccines').subscribe({
      next: (vaccineData) => {
        const vaccineListText = this.convertVaccineListToText(vaccineData);

        // ✅ Log để bạn kiểm tra xem vaccine có được convert đúng không
        console.log('📦 Danh sách vắc xin dạng văn bản:\n', vaccineListText);

        // 🔁 Bước 2: Tạo prompt rõ ràng cho GPT
        const systemPrompt = this.buildPromptFromVaccines(vaccineListText);

        const messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: msg },
        ];

        console.log('🧠 Prompt system gửi GPT:\n', systemPrompt);

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization:
            'Bearer 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`',
          'HTTP-Referer': 'http://localhost:4200',
        });

        const body = {
          model: 'deepseek/deepseek-r1-0528:free',
          messages,
        };

        // 🔁 Bước 3: Gửi tới GPT
        this.http
          .post<any>('https://openrouter.ai/api/v1/chat/completions', body, {
            headers,
          })
          .subscribe({
            next: (res) => {
              const reply = res.choices[0].message.content.trim();
              this.messages.push({ role: 'assistant', content: reply });
              this.isLoading = false;
            },
            error: (err) => {
              console.error('GPT lỗi:', err);
              this.messages.push({
                role: 'assistant',
                content: '⚠️ Có lỗi xảy ra khi gọi GPT. Vui lòng thử lại.',
              });
              this.isLoading = false;
            },
          });
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách vắc xin:', err);
        this.messages.push({
          role: 'assistant',
          content: '⚠️ Không thể lấy danh sách vắc xin từ hệ thống.',
        });
        this.isLoading = false;
      },
    });
  }

  // ✅ Hàm convert JSON → văn bản dễ hiểu
  convertVaccineListToText(json: any): string {
    if (!json || !json.$values) return 'Không có dữ liệu vắc xin.';
    return json.$values
      .map((vac: any) => {
        const ten = vac.tenVac;
        const mui = vac.soMui;
        const cach =
          mui > 1 ? `, tiêm cách nhau ${vac.thoiGianGiuaMui} ngày` : '';
        const hang = vac.hangSanXuat;
        return `- ${ten}: ${mui} mũi${cach}, sản xuất bởi ${hang}`;
      })
      .join('\n');
  }

  // ✅ Prompt system được sinh động + dễ điều chỉnh
  buildPromptFromVaccines(vaccineListText: string): string {
    return `
Bạn là một trợ lý tư vấn vắc xin cho phòng khám.

Dưới đây là danh sách các loại vắc xin hiện tại đang có trong hệ thống:

${vaccineListText}

Hãy tư vấn người dùng dựa đúng theo danh sách trên. 
Không liệt kê vắc xin nào khác không có trong danh sách.
Hãy trả lời ngắn gọn, dễ hiểu và ưu tiên tính chính xác.
`;
  }
}
