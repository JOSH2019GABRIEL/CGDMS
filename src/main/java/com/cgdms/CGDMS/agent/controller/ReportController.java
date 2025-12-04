package com.cgdms.CGDMS.agent.controller;


import com.cgdms.CGDMS.agent.entity.response.CommissionSchemeResponse;
import com.cgdms.CGDMS.agent.service.OrderService;
import com.cgdms.CGDMS.agent.service.mapper.OrderMapperService;
import com.cgdms.CGDMS.common.ExcelServiceGenerator;
import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDate;


@RestController
@RequestMapping("reports")
@Tag(name = "System Report")
@RequiredArgsConstructor
public class ReportController {

    private final ExcelServiceGenerator generate;
    private SXSSFWorkbook workbook;
    private final OrderService orderService;

//    @GetMapping("/reports/per-agent/export")
//    public void exportReport(
//            @RequestParam(required = false) Long agentId,
//            @RequestParam String start,
//            @RequestParam String end,
//            @RequestParam(defaultValue = "FULFILLED") String status,
//            HttpServletResponse response
//    ) throws IOException {
//        orderService.getPerAgentReport(agentId, start, end, status, response);
//    }

    @GetMapping("/per-agent/dashboard")
    public ResponseEntity<PageResponse<OrderMapperService.PerAgentReportResponse>> fetchPerAgentReport(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(required = false) Integer agentId,
            @RequestParam LocalDate start,
            @RequestParam LocalDate end,
            @RequestParam(required = false) String status
    ) {
        PageResponse<OrderMapperService.PerAgentReportResponse> report = orderService.getPerAgentReport(page, size, agentId, start, end, status);
        return ResponseEntity.ok(report);
    }



    @GetMapping("/per-agent/export")
    public void exportPerAgentReport(
            @RequestParam(required = false) Long agentId,
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam String status,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=per-agent-report.xlsx");

        workbook.write(response.getOutputStream());
    }










    private void setStream(ByteArrayOutputStream baos, HttpServletResponse response) throws IOException {
        response.setHeader("Content-Type", "application/octet-stream");
        response.setHeader("Content-Length", Integer.toString(baos.size()));
        OutputStream outputStream = response.getOutputStream();
        outputStream.write(baos.toByteArray());
        outputStream.close();
        response.flushBuffer();
    }
}
