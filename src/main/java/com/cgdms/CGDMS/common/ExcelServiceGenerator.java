package com.cgdms.CGDMS.common;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@AllArgsConstructor
@Service
public class ExcelServiceGenerator {

    private final ExcelService excelService;
    private final ExcelDataMapper dataMapper;

//    public ByteArrayOutputStream generateReport(LocalDate start, LocalDate end) {
//        try {
//            List<PharmacyReportProjection> requestReport = reportRepository.getAllRequestOrder(start, end);
//            List<Map<Integer, Object>> data = dataMapper.requestOrderMapper(requestReport);
//            return excelService.generate(REPORT_SHEET_NAME, data, REPORT_HEADERS);
//        } catch (Exception e) {
//            log.error("Error Occurred when generating Report!!!....");
//            e.printStackTrace();
//        }
//        log.info("End generate report");
//        return null;
//    }

    public static final List<String> DRUG_REPORT_HEADERS = Arrays.asList("s/No",
            "Drug Name", "Batch Number", "Invoice Number", "Issued To", "Physical Balance", "Negative Adjustment",
            "Positive Adjustment", "Quantity Issued", "Received From", "Expirey Date", "Date Created");
    public static final List<String> REPORT_HEADERS = Arrays.asList("s/No",
            "Drug Name", "Cubicle", "Selling Price", "Cost Price", "Price in Pack", "Completed Status");

    public static final String REPORT_SHEET_NAME = "request_order";
    public static final String DRUG_SHEET_NAME = "drug_report";

}
